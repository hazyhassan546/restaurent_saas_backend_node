export interface IUser {
  id: string;
  full_name: string;
  phone: string;
  password_hash: string;
  gender: string;
  profile_image: string;
  is_phone_verified: boolean;
  status: string;
  created_at: Date;
  updated_at: Date;
}
