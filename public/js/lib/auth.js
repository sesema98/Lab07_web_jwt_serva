const TOKEN_KEY = 'auth_token';

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
        return JSON.parse(window.atob(padded));
    } catch (_err) {
        return null;
    }
}

function isExpired(payload) {
    return !payload?.exp || (payload.exp * 1000) <= Date.now();
}

export function getToken() {
    return window.sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    window.sessionStorage.removeItem(TOKEN_KEY);
}

export function getActiveSession({ redirectOnFail = false, redirectTo = '/signIn' } = {}) {
    const token = getToken();
    if (!token) {
        if (redirectOnFail) window.location.replace(redirectTo);
        return null;
    }

    const payload = parseJwt(token);
    if (!payload || isExpired(payload)) {
        clearToken();
        if (redirectOnFail) window.location.replace(redirectTo);
        return null;
    }

    return { token, payload };
}

export function getRoles() {
    return getActiveSession()?.payload?.roles ?? [];
}

export function redirectToDashboard() {
    const roles = getRoles();
    const destination = roles.includes('admin') ? '/dashboard/admin' : '/dashboard/user';
    window.location.replace(destination);
}

export function logout(redirectTo = '/signIn') {
    clearToken();
    window.location.replace(redirectTo);
}

export function requireAuth({ roles = [], redirectTo = '/signIn', forbiddenTo = '/403' } = {}) {
    const session = getActiveSession({ redirectOnFail: true, redirectTo });
    if (!session) return null;

    if (roles.length > 0) {
        const hasEnoughRole = (session.payload.roles || []).some(role => roles.includes(role));
        if (!hasEnoughRole) {
            window.location.replace(forbiddenTo);
            return null;
        }
    }

    return session;
}

export async function apiFetch(path, options = {}) {
    const { publicRequest = false, headers: customHeaders, body, ...rest } = options;
    const session = publicRequest ? null : getActiveSession({ redirectOnFail: true });

    const headers = new Headers(customHeaders || {});
    let normalizedBody = body;

    if (body && !(body instanceof FormData) && typeof body !== 'string') {
        headers.set('Content-Type', headers.get('Content-Type') || 'application/json');
        normalizedBody = JSON.stringify(body);
    }

    if (session?.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
    }

    const response = await fetch(path, {
        ...rest,
        headers,
        body: normalizedBody
    });

    if (!publicRequest && response.status === 401) {
        logout();
        throw new Error('Token no válido o caducado');
    }

    return response;
}

export async function apiJson(path, options = {}) {
    const response = await apiFetch(path, options);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message || 'Ocurrió un error inesperado');
    }

    return payload;
}
