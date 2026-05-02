export function calculateAge(birthdate) {
    if (!birthdate) return null;

    const parsed = new Date(birthdate);
    if (Number.isNaN(parsed.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - parsed.getFullYear();
    const monthDifference = today.getMonth() - parsed.getMonth();

    if (
        monthDifference < 0
        || (monthDifference === 0 && today.getDate() < parsed.getDate())
    ) {
        age -= 1;
    }

    return age >= 0 ? age : null;
}

export function formatDate(date) {
    if (!date) return '--';

    return new Intl.DateTimeFormat('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}
