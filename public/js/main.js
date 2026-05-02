import { getActiveSession, getRoles, logout } from '/js/lib/auth.js';

function initMaterialize() {
    if (!window.M) return;

    window.M.Sidenav.init(document.querySelectorAll('.sidenav'));
    window.M.Modal.init(document.querySelectorAll('.modal'));
}

function setActiveNav() {
    const pageId = document.body.dataset.page;
    if (!pageId) return;

    document.querySelectorAll(`[data-nav="${pageId}"]`).forEach(link => {
        link.classList.add('active');
    });
}

function bindLogout() {
    document.querySelectorAll('[data-logout]').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            logout();
        });
    });
}

function updateRoleVisibility() {
    const session = getActiveSession();
    const roles = getRoles();
    const isAdmin = roles.includes('admin');

    document.querySelectorAll('.admin-only').forEach(element => {
        element.classList.toggle('hide', !isAdmin);
    });

    document.querySelectorAll('[data-user-badge]').forEach(badge => {
        if (!session) {
            badge.textContent = 'Sesión pública';
            return;
        }

        badge.textContent = roles.includes('admin') ? 'Rol admin' : 'Rol user';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMaterialize();
    setActiveNav();
    bindLogout();
    updateRoleVisibility();
});
