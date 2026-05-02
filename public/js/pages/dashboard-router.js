import { requireAuth, redirectToDashboard } from '/js/lib/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const session = requireAuth({ roles: ['user', 'admin'] });
    if (!session) return;

    redirectToDashboard();
});
