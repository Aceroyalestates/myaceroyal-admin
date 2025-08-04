import { IResponse } from "./generic";

export interface UsersResponse extends IResponse {
  data: User[];
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  avatar: string;
  gender: string;
  date_of_birth: string;
  is_verified: boolean;
  role_id: number;
  referral_code: string;
  is_active: boolean | string;
  createdAt: string;
  updatedAt: string;
}
