export interface IDriver {
  id: string;
  user_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  country_code?: string;
  profile_picture?: string;
  license_number?: string;
  rating: number;
  total_rides: number;
  verification_status: string;
  created_at: Date;
  updated_at: Date;
}
