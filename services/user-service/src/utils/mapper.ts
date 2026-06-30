import { IUser } from '../interfaces/user.interface';
import { ProfileDto } from '../dto/profile.dto';

export const mapUserToProfileDto = (user: IUser): ProfileDto => {
  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone_number: user.phone_number,
    role: user.role,
    created_at: user.created_at,
  };
};
