import { IResponse, Activity } from './generic';

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

  financial_transactions: {
    total_assets: number;
    outstanding_bills: number;
    number_of_installments: number;
    next_installment_payment: number;
    next_payment_due_date: string;
    total_purchases: number;
    completed_payments: number;
    pending_payments: number;
  };
  role: Role;
}

export interface ActivityLogsResponse extends IResponse {
  data: Activity[];
}
