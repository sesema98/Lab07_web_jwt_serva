import express from 'express';

const router = express.Router();

function renderPage(view, options = {}) {
    return (_req, res) => {
        res.render(`pages/${view}`, {
            title: options.title ?? 'Express Mongo Auth',
            pageScript: options.pageScript ?? null,
            pageId: options.pageId ?? '',
            bodyClass: options.bodyClass ?? '',
            showNavbar: options.showNavbar ?? false
        });
    };
}

router.get('/', (_req, res) => res.redirect('/signIn'));
router.get('/signIn', renderPage('sign-in', {
    title: 'Sign In',
    pageScript: '/js/pages/sign-in.js',
    pageId: 'signin',
    bodyClass: 'auth-shell'
}));
router.get('/signUp', renderPage('sign-up', {
    title: 'Sign Up',
    pageScript: '/js/pages/sign-up.js',
    pageId: 'signup',
    bodyClass: 'auth-shell'
}));
router.get('/dashboard', renderPage('dashboard-router', {
    title: 'Dashboard',
    pageScript: '/js/pages/dashboard-router.js',
    pageId: 'dashboard',
    bodyClass: 'app-shell',
    showNavbar: true
}));
router.get('/dashboard/user', renderPage('dashboard-user', {
    title: 'Dashboard de Usuario',
    pageScript: '/js/pages/user-dashboard.js',
    pageId: 'dashboard-user',
    bodyClass: 'app-shell',
    showNavbar: true
}));
router.get('/dashboard/admin', renderPage('dashboard-admin', {
    title: 'Dashboard de Administrador',
    pageScript: '/js/pages/admin-dashboard.js',
    pageId: 'dashboard-admin',
    bodyClass: 'app-shell',
    showNavbar: true
}));
router.get('/profile', renderPage('profile', {
    title: 'Mi Cuenta',
    pageScript: '/js/pages/profile.js',
    pageId: 'profile',
    bodyClass: 'app-shell',
    showNavbar: true
}));
router.get('/403', renderPage('403', {
    title: 'Acceso Denegado',
    pageId: '403',
    bodyClass: 'status-shell'
}));

export default router;
