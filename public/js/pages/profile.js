import { apiJson, requireAuth } from '/js/lib/auth.js';
import { calculateAge, formatDate } from '/js/lib/date.js';

let currentUser = null;

function applyTextFields() {
    window.M?.updateTextFields();
}

function updateAgeField() {
    const birthdateValue = document.getElementById('profileBirthdate').value;
    const age = calculateAge(birthdateValue);
    document.getElementById('profileAge').value = age ?? '';
    document.getElementById('profileAgeSummary').textContent = age ?? '--';
    applyTextFields();
}

function fillForm(user) {
    currentUser = user;

    document.getElementById('profileHeading').textContent = `${user.name} ${user.lastName}`;
    document.getElementById('profileRoles').textContent = user.roles.join(', ');
    document.getElementById('profileCreatedAt').textContent = formatDate(user.createdAt);

    document.getElementById('profileName').value = user.name;
    document.getElementById('profileLastName').value = user.lastName;
    document.getElementById('profilePhoneNumber').value = user.phoneNumber;
    document.getElementById('profileBirthdate').value = user.birthdate?.slice(0, 10) ?? '';
    document.getElementById('profileEmail').value = user.email;
    document.getElementById('profileAge').value = user.age ?? '';
    document.getElementById('profileAgeSummary').textContent = user.age ?? '--';

    applyTextFields();
}

document.addEventListener('DOMContentLoaded', async () => {
    const session = requireAuth({ roles: ['user', 'admin'] });
    if (!session) return;

    const form = document.getElementById('profileForm');
    const birthdateInput = document.getElementById('profileBirthdate');
    const submitButton = document.getElementById('profileSaveButton');

    birthdateInput.addEventListener('input', updateAgeField);

    try {
        const user = await apiJson('/api/users/me');
        fillForm(user);
    } catch (err) {
        window.M?.toast({ html: err.message });
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();
        submitButton.disabled = true;

        try {
            const updatedUser = await apiJson('/api/users/me', {
                method: 'PUT',
                body: {
                    name: form.name.value,
                    lastName: form.lastName.value,
                    phoneNumber: form.phoneNumber.value,
                    birthdate: form.birthdate.value,
                    email: form.email.value
                }
            });

            fillForm(updatedUser);
            window.M?.toast({ html: 'Perfil actualizado correctamente' });
        } catch (err) {
            window.M?.toast({ html: err.message });
            if (currentUser) fillForm(currentUser);
        } finally {
            submitButton.disabled = false;
        }
    });
});
