import { userRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUser } from '../interfaces/user.interface';
import { redisClient } from '../config/redis';
import { publishEvent } from '../events/producer';
import { TOPICS } from '../utils/constants';

export class UserService {
  public async createUser(userData: CreateUserDto): Promise<IUser> {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = await userRepository.create(userData);

    await publishEvent(TOPICS.USER_CREATED, { id: user.id, email: user.email, role: user.role });

    return user;
  }

  public async getUserById(id: string): Promise<IUser | null> {
    const cacheKey = `user:${id}`;
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser) as IUser;
    }

    const user = await userRepository.findById(id);

    if (user) {
      await redisClient.setex(cacheKey, 3600, JSON.stringify(user));
    }

    return user;
  }

  public async updateUser(id: string, updateData: UpdateUserDto): Promise<IUser | null> {
    const updatedUser = await userRepository.update(id, updateData);

    if (updatedUser) {
      await redisClient.del(`user:${id}`);
      
      // Decouple Kafka (Fire-and-forget) to prevent HTTP blocking
      publishEvent(TOPICS.USER_UPDATED, { id: updatedUser.id, updates: updateData }).catch(err => {
        console.error('[UserService] Failed to publish user.updated event:', err.message);
      });
    }

    return updatedUser;
  }
}

export const userService = new UserService();
