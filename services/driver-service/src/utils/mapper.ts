import { IDriver } from '../interfaces/driver.interface';
import { DriverProfileDto } from '../dto/driver-profile.dto';

export const mapDriverToProfileDto = (driver: IDriver): DriverProfileDto => {
  return {
    id: driver.id,
    user_id: driver.user_id,
    email: driver.email,
    first_name: driver.first_name,
    last_name: driver.last_name,
    phone_number: driver.phone_number,
    country_code: driver.country_code,
    profile_picture: driver.profile_picture,
    license_number: driver.license_number,
    rating: driver.rating,
    total_rides: driver.total_rides,
    verification_status: driver.verification_status,
    created_at: driver.created_at,
  };
};
