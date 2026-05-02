import { apiJson, getActiveSession, redirectToDashboard } from '/js/lib/auth.js';
import { calculateAge } from '/js/lib/date.js';

function updateAgePreview(input, target) {
    const age = calculateAge(input.value);
    target.textContent = age ?? '--';
}

document.addEventListener('DOMContentLoaded', () => {
    if (getActiveSession()) {
        redirectToDashboard();
        return;
    }

    const form = document.getElementById('signUpForm');
    const birthdateInput = document.getElementById('birthdate');
    const agePreview = document.getElementById('agePreview');
    const submitButton = document.getElementById('signUpButton');

    birthdateInput.addEventListener('input', () => updateAgePreview(birthdateInput, agePreview));

    form.addEventListener('submit', async event => {
        event.preventDefault();
        submitButton.disabled = true;

        try {
            await apiJson('/api/auth/signUp', {
                method: 'POST',
                publicRequest: true,
                body: {
                    name: form.name.value,
                    lastName: form.lastName.value,
                    phoneNumber: form.phoneNumber.value,
                    birthdate: form.birthdate.value,
                    email: form.email.value,
                    password: form.password.value
                }
            });

            window.M?.toast({ html: 'Cuenta creada. Ahora inicia sesión.' });
            window.location.replace('/signIn');
        } catch (err) {
            window.M?.toast({ html: err.message });
        } finally {
            submitButton.disabled = false;
        }
    });
});
