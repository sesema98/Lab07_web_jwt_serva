import userRepository from '../repositories/UserRepository.js';
import { mapUserDetail, mapUserSummary } from '../utils/mapUserDto.js';
import { normalizeUserProfilePayload } from '../utils/userPayload.js';

class UserService {

    async getAll() {
        const users = await userRepository.getAll();
        return users.map(mapUserSummary);
    }

    async getById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        return mapUserDetail(user);
    }

    async updateProfile(id, payload) {
        const normalizedPayload = normalizeUserProfilePayload(payload);
        const existing = await userRepository.findByEmail(normalizedPayload.email);

        if (existing && String(existing._id) !== String(id)) {
            const err = new Error('El email ya se encuentra en uso');
            err.status = 400;
            throw err;
        }

        const updatedUser = await userRepository.updateById(id, normalizedPayload);
        if (!updatedUser) {
            const err = new Error('Usuario no encontrado');
            err.status = 404;
            throw err;
        }

        return mapUserDetail(updatedUser);
    }
}

export default new UserService();
