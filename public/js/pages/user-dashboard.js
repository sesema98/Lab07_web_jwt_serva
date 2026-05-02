import { apiJson, requireAuth } from '/js/lib/auth.js';
import { formatDate } from '/js/lib/date.js';

function renderUser(user) {
    document.getElementById('welcomeTitle').textContent = `Bienvenido, ${user.name} ${user.lastName}`;
    document.getElementById('welcomeCopy').textContent = 'Aquí están tus datos actuales y el acceso directo a tu perfil.';
    document.getElementById('roleChip').textContent = user.roles.join(', ');
    document.getElementById('ageChip').textContent = `${user.age} años`;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userPhone').textContent = user.phoneNumber;
    document.getElementById('userBirthdate').textContent = formatDate(user.birthdate);
    document.getElementById('userCreatedAt').textContent = formatDate(user.createdAt);
    document.getElementById('fullNameCard').textContent = `${user.name} ${user.lastName}`;
    document.getElementById('rolesCard').textContent = user.roles.join(', ');

    if (user.roles.includes('admin')) {
        document.getElementById('adminShortcut').classList.remove('hide');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const session = requireAuth({ roles: ['user', 'admin'] });
    if (!session) return;

    try {
        const user = await apiJson('/api/users/me');
        renderUser(user);
    } catch (err) {
        window.M?.toast({ html: err.message });
    }
});
