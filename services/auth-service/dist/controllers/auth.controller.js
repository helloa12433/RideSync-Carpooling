"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRole = exports.getMe = exports.logout = exports.refresh = exports.googleLogin = void 0;
const auth_service_1 = require("../services/auth.service");
const logger_1 = require("../utils/logger");
const googleLogin = async (req, res, next) => {
    try {
        logger_1.logger.info('Incoming Google Login Request');
        const { idToken } = req.body;
        if (!idToken) {
            logger_1.logger.warn('Google Login failed: idToken is missing');
            return res.status(400).json({ message: 'idToken is required' });
        }
        const result = await auth_service_1.authService.googleLogin(idToken);
        logger_1.logger.info('Sending Response To API Gateway');
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.logger.error('Error during Google Login', { error: error.message });
        next(error);
    }
};
exports.googleLogin = googleLogin;
const refresh = async (req, res, next) => {
    try {
        logger_1.logger.info('Incoming Refresh Token Request received');
        const { refreshToken } = req.body;
        if (!refreshToken) {
            logger_1.logger.warn('Refresh failed: refreshToken is missing');
            return res.status(400).json({ message: 'refreshToken is required' });
        }
        const result = await auth_service_1.authService.refresh(refreshToken);
        logger_1.logger.info('Refresh successful, new tokens generated');
        res.status(200).json(result);
    }
    catch (error) {
        logger_1.logger.error('Error during Token Refresh', { error: error.message });
        next(error);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        logger_1.logger.info('Incoming Logout Request received', { userId });
        if (!userId) {
            logger_1.logger.warn('Logout failed: Unauthorized');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await auth_service_1.authService.logout(userId);
        logger_1.logger.info('Logout successful', { userId });
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        logger_1.logger.error('Error during Logout', { error: error.message });
        next(error);
    }
};
exports.logout = logout;
const getMe = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await auth_service_1.authService.getMe(userId);
        res.status(200).json({ user });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const updateRole = async (req, res, next) => {
    try {
        const userId = req.user?.userId;
        const { role } = req.body;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        if (!role || (role !== 'USER' && role !== 'DRIVER')) {
            return res.status(400).json({ message: 'Valid role (USER or DRIVER) is required' });
        }
        const result = await auth_service_1.authService.updateRole(userId, role);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.updateRole = updateRole;
