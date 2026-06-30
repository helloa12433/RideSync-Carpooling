export interface CreateUserDto {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role?: string;
}
