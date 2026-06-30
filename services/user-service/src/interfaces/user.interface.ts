export interface IUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  country_code?: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}
