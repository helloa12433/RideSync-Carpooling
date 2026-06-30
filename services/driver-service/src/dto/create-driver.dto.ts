export interface CreateDriverDto {
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  license_number?: string;
}
