import { OAuth2Client } from 'google-auth-library';
import { authRepository } from '../repositories/auth.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { publishEvent } from '../config/kafka';
import { logger } from '../utils/logger';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class AuthService {
  async googleLogin(idToken: string, clientType: string = 'user') {
    logger.info('[AuthService] Google Login Started');
    logger.info('[AuthService] Client Type Detected', { clientType });
    logger.info('[AuthService] Verifying Google Token...');

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error('Invalid Google Token');
    }
    logger.info('[AuthService] Google Token Verified');

    const { email, given_name, family_name, picture, sub: googleId } = payload;

    logger.info('[AuthService] Looking up account in Cassandra', { email });
    let account = await authRepository.getAccountByEmail(email);
    let isNewUser = false;

    if (!account) {
      logger.info('[AuthService] New account — creating in accounts table', { email });
      account = await authRepository.createAccount({
        email,
        google_id: googleId || '',
        first_name: given_name || '',
        last_name: family_name || '',
        profile_picture: picture || '',
        role: clientType === 'driver' ? 'DRIVER' : 'USER',
      });
      isNewUser = true;

      logger.info('[AuthService] Account created', { accountId: account.id });
      logger.info('[AuthService] Publishing auth.user.registered to Kafka...');

      await publishEvent('auth.user.registered', {
        userId:          account.id,
        email:           account.email,
        first_name:      given_name  || '',
        last_name:       family_name || '',
        profile_picture: picture     || '',
        client_type:     clientType,
        timestamp:       new Date().toISOString(),
      });

      logger.info('[AuthService] Kafka auth.user.registered published');
    } else {
      logger.info('[AuthService] Existing account found', { accountId: account.id });
      await publishEvent('auth.user.loggedin', {
        userId:      account.id,
        email:       account.email,
        client_type: clientType,
        timestamp:   new Date().toISOString(),
      });
    }

    logger.info('[AuthService] Generating Access Token...');
    const accessToken = generateAccessToken(account.id, account.role, clientType);
    logger.info('[AuthService] Generating Refresh Token...');
    const refreshToken = generateRefreshToken(account.id);

    logger.info('[AuthService] Storing Refresh Token in Redis...');
    await authRepository.storeRefreshToken(account.id, refreshToken, 7 * 24 * 60 * 60);

    logger.info('[AuthService] Authentication Success', {
      accountId: account.id,
      email: account.email,
      clientType,
    });

    return {
      user: {
        id:              account.id,
        email:           account.email,
        first_name:      account.first_name,
        last_name:       account.last_name,
        profile_picture: account.profile_picture,
        role:            account.role,
      },
      accessToken,
      refreshToken,
      isNewUser,
    };
  }

  async refresh(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId as string;

    const storedToken = await authRepository.getRefreshToken(userId);
    if (!storedToken || storedToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const account = await authRepository.getAccountById(userId);
    if (!account) throw new Error('Account not found');

    const newAccessToken = generateAccessToken(userId, account.role, 'user');
    const newRefreshToken = generateRefreshToken(userId);
    await authRepository.storeRefreshToken(userId, newRefreshToken, 7 * 24 * 60 * 60);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(userId: string) {
    await authRepository.deleteRefreshToken(userId);
    await publishEvent('auth.user.logout', { userId });
  }

  async getMe(userId: string) {
    const account = await authRepository.getAccountById(userId);
    if (!account) throw new Error('Account not found');
    return account;
  }

  async updateRole(userId: string, role: string) {
    const account = await authRepository.getAccountById(userId);
    if (!account) throw new Error('Account not found');

    await authRepository.updateRole(userId, role);
    account.role = role;

    const accessToken = generateAccessToken(userId, role, 'user');
    const refreshToken = generateRefreshToken(userId);
    await authRepository.storeRefreshToken(userId, refreshToken, 7 * 24 * 60 * 60);

    return { user: account, accessToken, refreshToken };
  }
}

export const authService = new AuthService();
