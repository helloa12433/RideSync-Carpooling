import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendSuccess, sendError } from '../utils/response';
import { mapUserToProfileDto } from '../utils/mapper';
import { CreateUserDto } from '../dto/create-user.dto';

export class UserController {
  public async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 401, 'Unauthorized');
        return;
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        sendError(res, 404, 'User not found');
        return;
      }

      sendSuccess(res, 200, 'Profile fetched successfully', mapUserToProfileDto(user));
    } catch (error) {
      next(error);
    }
  }

  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createDto: CreateUserDto = {
        email: req.body.email,
        password_hash: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
        role: req.body.role,
      };

      const user = await userService.createUser(createDto);
      sendSuccess(res, 201, 'User created successfully', mapUserToProfileDto(user));
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        sendError(res, 409, error.message);
      } else {
        next(error);
      }
    }
  }

  public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log('User Service Started');
      console.log('↓');
      console.log('\n[UserController] Incoming Edit Profile Request');
      console.log('[UserController] Payload:', JSON.stringify(req.body));

      const userId = req.user?.id;
      if (!userId) {
        sendError(res, 401, 'Unauthorized');
        return;
      }

      console.log('Payload Validated');
      console.log('↓');
      console.log('[UserController] Validated Payload (proceeding to Service):', JSON.stringify(req.body));

      const updatedUser = await userService.updateUser(userId, req.body);
      if (!updatedUser) {
        console.log('[UserController] Update Failed: User not found');
        sendError(res, 404, 'User not found');
        return;
      }

      console.log('[UserController] Profile Update Success');
      console.log('Returning HTTP 200 Response');
      console.log('↓');
      sendSuccess(res, 200, 'Profile updated successfully', mapUserToProfileDto(updatedUser));
    } catch (error: any) {
      console.error('[UserController] Update Profile Failed:', error.message);
      next(error);
    }
  }
}

export const userController = new UserController();
