export default function calculateAge(birthdate) {
    if (!birthdate) return null;

    const parsedBirthdate = birthdate instanceof Date ? birthdate : new Date(birthdate);
    if (Number.isNaN(parsedBirthdate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - parsedBirthdate.getFullYear();
    const monthDifference = today.getMonth() - parsedBirthdate.getMonth();

    if (
        monthDifference < 0
        || (monthDifference === 0 && today.getDate() < parsedBirthdate.getDate())
    ) {
        age -= 1;
    }

    return age >= 0 ? age : null;
}
