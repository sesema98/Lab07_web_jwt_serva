import bcrypt from 'bcrypt';
import roleRepository from '../repositories/RoleRepository.js';
import userRepository from '../repositories/UserRepository.js';

const seedAccounts = [
    {
        email: 'admin@example.com',
        password: 'Admin123!',
        name: 'Admin',
        lastName: 'Principal',
        phoneNumber: '999888777',
        birthdate: new Date('1990-01-15'),
        roles: ['admin', 'user']
    },
    {
        email: 'user@example.com',
        password: 'User123!',
        name: 'Usuario',
        lastName: 'Demo',
        phoneNumber: '988777666',
        birthdate: new Date('1998-06-20'),
        roles: ['user']
    }
];

async function resolveRoleIds(roleNames) {
    const roleIds = [];

    for (const roleName of roleNames) {
        let role = await roleRepository.findByName(roleName);
        if (!role) role = await roleRepository.create({ name: roleName });
        roleIds.push(role._id);
    }

    return roleIds;
}

export default async function seedUsers() {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);

    for (const account of seedAccounts) {
        const existing = await userRepository.findByEmail(account.email);
        if (existing) continue;

        const hashedPassword = await bcrypt.hash(account.password, saltRounds);
        const roleIds = await resolveRoleIds(account.roles);

        await userRepository.create({
            email: account.email,
            password: hashedPassword,
            name: account.name,
            lastName: account.lastName,
            phoneNumber: account.phoneNumber,
            birthdate: account.birthdate,
            roles: roleIds
        });

        console.log(`Seeded user: ${account.email}`);
    }
}
