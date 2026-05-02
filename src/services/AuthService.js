import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';
import { mapUserDetail } from '../utils/mapUserDto.js';
import { normalizeUserProfilePayload } from '../utils/userPayload.js';

class AuthService {

    async signUp(payload) {
        const normalizedPayload = normalizeUserProfilePayload(payload, { requirePassword: true });

        const existing = await userRepository.findByEmail(normalizedPayload.email);
        if (existing) {
            const err = new Error('El email ya se encuentra en uso');
            err.status = 400;
            throw err;
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        const hashed = await bcrypt.hash(normalizedPayload.password, saltRounds);

        let userRole = await roleRepository.findByName('user');
        if (!userRole) userRole = await roleRepository.create({ name: 'user' });

        const user = await userRepository.create({
            ...normalizedPayload,
            password: hashed,
            roles: [userRole._id]
        });

        const createdUser = await userRepository.findById(user._id);
        return mapUserDetail(createdUser);
    }

    async signIn({ email, password }) {
        const user = await userRepository.findByEmail(email.trim().toLowerCase());
        if (!user) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            const err = new Error('Credenciales inválidas');
            err.status = 401;
            throw err;
        }

        const token = jwt.sign({ 
            sub: user._id, 
            roles: user.roles.map(r => r.name) }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
            }
        );

        return { token };
    }
}

export default new AuthService();
