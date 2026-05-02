import calculateAge from './calculateAge.js';

function badRequest(message) {
    const err = new Error(message);
    err.status = 400;
    return err;
}

function requiredTrimmedString(value, fieldLabel) {
    if (typeof value !== 'string' || value.trim() === '') {
        throw badRequest(`El campo ${fieldLabel} es requerido`);
    }

    return value.trim();
}

function normalizeBirthdate(value) {
    if (!value) throw badRequest('El campo fecha de nacimiento es requerido');

    const birthdate = new Date(value);
    if (Number.isNaN(birthdate.getTime())) {
        throw badRequest('La fecha de nacimiento no es válida');
    }

    const age = calculateAge(birthdate);
    if (age === null) {
        throw badRequest('La fecha de nacimiento no puede ser futura');
    }

    return birthdate;
}

export function normalizeUserProfilePayload(payload, { requirePassword = false } = {}) {
    const normalizedPayload = {
        email: requiredTrimmedString(payload.email, 'email').toLowerCase(),
        name: requiredTrimmedString(payload.name, 'nombre'),
        lastName: requiredTrimmedString(payload.lastName, 'apellido'),
        phoneNumber: requiredTrimmedString(payload.phoneNumber, 'teléfono'),
        birthdate: normalizeBirthdate(payload.birthdate)
    };

    if (requirePassword) {
        const password = requiredTrimmedString(payload.password, 'password');
        if (password.length < 6) {
            throw badRequest('El password debe tener al menos 6 caracteres');
        }

        normalizedPayload.password = password;
    }

    return normalizedPayload;
}
