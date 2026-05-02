import calculateAge from './calculateAge.js';

function normalizeDate(value) {
    if (!value) return null;

    const parsedDate = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return null;

    return parsedDate.toISOString();
}

function mapRoles(roles = []) {
    return roles
        .map(role => (typeof role === 'string' ? role : role?.name))
        .filter(Boolean);
}

function mapBaseUser(user) {
    return {
        id: String(user._id),
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        birthdate: normalizeDate(user.birthdate),
        age: calculateAge(user.birthdate),
        roles: mapRoles(user.roles),
        createdAt: normalizeDate(user.createdAt),
        updatedAt: normalizeDate(user.updatedAt)
    };
}

export function mapUserSummary(user) {
    return mapBaseUser(user);
}

export function mapUserDetail(user) {
    return mapBaseUser(user);
}
