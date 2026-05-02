import { apiJson, getActiveSession, redirectToDashboard, setToken } from '/js/lib/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    if (getActiveSession()) {
        redirectToDashboard();
        return;
    }

    const form = document.getElementById('signInForm');
    const submitButton = document.getElementById('signInButton');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        submitButton.disabled = true;

        try {
            const payload = {
                email: form.email.value,
                password: form.password.value
            };

            const response = await apiJson('/api/auth/signIn', {
                method: 'POST',
                publicRequest: true,
                body: payload
            });

            setToken(response.token);
            window.M?.toast({ html: 'Sesión iniciada correctamente' });
            redirectToDashboard();
        } catch (err) {
            window.M?.toast({ html: err.message });
        } finally {
            submitButton.disabled = false;
        }
    });
});
