"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const google_auth_library_1 = require("google-auth-library");
const auth_repository_1 = require("../repositories/auth.repository");
const jwt_1 = require("../utils/jwt");
const kafka_1 = require("../config/kafka");
const logger_1 = require("../utils/logger");
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class AuthService {
    async googleLogin(idToken) {
        logger_1.logger.info('Verifying Google Token');
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error('Invalid Google Token');
        }
        logger_1.logger.info('Google Token Verified');
        const { email, given_name, family_name, picture } = payload;
        logger_1.logger.info('Checking User In Cassandra');
        let user = await auth_repository_1.authRepository.getUserByEmail(email);
        let isNewUser = false;
        if (!user) {
            logger_1.logger.info('New User Created');
            user = await auth_repository_1.authRepository.createUser({
                email,
                first_name: given_name || '',
                last_name: family_name || '',
                profile_picture: picture || '',
                role: 'USER',
            });
            isNewUser = true;
            logger_1.logger.info('Kafka Publish');
            await (0, kafka_1.publishEvent)('auth.user.registered', { userId: user.id, email: user.email, timestamp: new Date().toISOString() });
        }
        else {
            logger_1.logger.info('Existing User Found');
            logger_1.logger.info('Publishing Kafka Event', { topic: 'auth.user.loggedin' });
            await (0, kafka_1.publishEvent)('auth.user.loggedin', { userId: user.id, email: user.email, timestamp: new Date().toISOString() });
        }
        logger_1.logger.info('Generating Access Token');
        const accessToken = (0, jwt_1.generateAccessToken)(user.id, user.role);
        logger_1.logger.info('Generating Refresh Token');
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        logger_1.logger.info('Saving Refresh Token In Redis');
        await auth_repository_1.authRepository.storeRefreshToken(user.id, refreshToken, 7 * 24 * 60 * 60);
        return {
            user,
            accessToken,
            refreshToken,
            isNewUser,
        };
    }
    async refresh(refreshToken) {
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const userId = decoded.userId;
        const storedToken = await auth_repository_1.authRepository.getRefreshToken(userId);
        if (!storedToken || storedToken !== refreshToken) {
            throw new Error('Invalid refresh token');
        }
        const user = await auth_repository_1.authRepository.getUserById(userId);
        if (!user)
            throw new Error('User not found');
        const newAccessToken = (0, jwt_1.generateAccessToken)(userId, user.role);
        const newRefreshToken = (0, jwt_1.generateRefreshToken)(userId);
        await auth_repository_1.authRepository.storeRefreshToken(userId, newRefreshToken, 7 * 24 * 60 * 60);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    async logout(userId) {
        await auth_repository_1.authRepository.deleteRefreshToken(userId);
        await (0, kafka_1.publishEvent)('auth.user.logout', { userId });
    }
    async getMe(userId) {
        const user = await auth_repository_1.authRepository.getUserById(userId);
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async updateRole(userId, role) {
        const user = await auth_repository_1.authRepository.getUserById(userId);
        if (!user)
            throw new Error('User not found');
        await auth_repository_1.authRepository.updateRole(userId, role);
        user.role = role;
        // Generate new tokens with updated role
        const accessToken = (0, jwt_1.generateAccessToken)(userId, role);
        const refreshToken = (0, jwt_1.generateRefreshToken)(userId);
        await auth_repository_1.authRepository.storeRefreshToken(userId, refreshToken, 7 * 24 * 60 * 60);
        return { user, accessToken, refreshToken };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
