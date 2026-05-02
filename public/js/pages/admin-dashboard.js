import { apiJson, requireAuth } from '/js/lib/auth.js';
import { formatDate } from '/js/lib/date.js';

function appendCell(row, text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    row.appendChild(cell);
}

function createRow(user) {
    const row = document.createElement('tr');
    appendCell(row, `${user.name} ${user.lastName}`);
    appendCell(row, user.email);
    appendCell(row, user.phoneNumber);
    appendCell(row, String(user.age ?? '--'));
    appendCell(row, user.roles.join(', '));
    appendCell(row, formatDate(user.createdAt));

    const actionCell = document.createElement('td');
    const button = document.createElement('button');
    button.className = 'btn-small accent-button waves-effect waves-light';
    button.dataset.userId = user.id;
    button.type = 'button';
    button.textContent = 'Ver información';
    actionCell.appendChild(button);
    row.appendChild(actionCell);

    return row;
}

function renderMetrics(users) {
    const adminCount = users.filter(user => user.roles.includes('admin')).length;
    const latestUser = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    document.getElementById('totalUsers').textContent = String(users.length);
    document.getElementById('adminUsers').textContent = String(adminCount);
    document.getElementById('standardUsers').textContent = String(users.length - adminCount);
    document.getElementById('latestRegistered').textContent = latestUser ? formatDate(latestUser.createdAt) : '--';
}

function renderTable(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.replaceChildren();

    if (users.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="7" class="center-align">No hay usuarios registrados.</td>';
        tbody.appendChild(emptyRow);
        return;
    }

    users.forEach(user => {
        tbody.appendChild(createRow(user));
    });
}

function renderModalUser(user) {
    document.getElementById('modalUserName').textContent = `${user.name} ${user.lastName}`;

    const detailContainer = document.getElementById('modalUserDetail');
    detailContainer.replaceChildren();

    const detailItems = [
        ['Email', user.email],
        ['Teléfono', user.phoneNumber],
        ['Fecha de nacimiento', formatDate(user.birthdate)],
        ['Edad', `${user.age ?? '--'} años`],
        ['Roles', user.roles.join(', ')],
        ['Fecha de registro', formatDate(user.createdAt)]
    ];

    detailItems.forEach(([label, value]) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'detail-item';

        const span = document.createElement('span');
        span.textContent = label;

        const strong = document.createElement('strong');
        strong.textContent = value;

        wrapper.append(span, strong);
        detailContainer.appendChild(wrapper);
    });
}

async function showUserDetail(userId) {
    try {
        const user = await apiJson(`/api/users/${userId}`);
        renderModalUser(user);
        const modalElement = document.getElementById('userDetailModal');
        const modalInstance = window.M?.Modal.getInstance(modalElement);
        modalInstance?.open();
    } catch (err) {
        window.M?.toast({ html: err.message });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const session = requireAuth({ roles: ['admin'] });
    if (!session) return;

    try {
        const users = await apiJson('/api/users');
        renderMetrics(users);
        renderTable(users);

        document.getElementById('usersTableBody').addEventListener('click', event => {
            const button = event.target.closest('[data-user-id]');
            if (!button) return;

            void showUserDetail(button.dataset.userId);
        });
    } catch (err) {
        window.M?.toast({ html: err.message });
    }
});
