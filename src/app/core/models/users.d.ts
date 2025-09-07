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
  google_id: string,
  failed_login_attempts: number,
  account_locked_at: string,
  is_account_locked: false,
  provider: string,
  provider_id: string,
  email_verified_at: string,
  referral_code:string,
  nationality_id: string,
  states_id: string,
  address: string,
  bank_verification_number: string,
  national_identity_number: string,
  means_of_identification: string,
  suspension_metadata: string,
  suspended_by: string,
  suspended_at: string,
  suspension_reason: string,
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
