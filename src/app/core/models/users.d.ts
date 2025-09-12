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
  google_id: string;
  failed_login_attempts: number;
  account_locked_at: string;
  is_account_locked: false;
  provider: string;
  provider_id: string;
  email_verified_at: string;
  referral_code: string;
  nationality_id: string;
  states_id: string;
  address: string;
  bank_verification_number: string;
  national_identity_number: string;
  means_of_identification: string;
  suspension_metadata: string;
  suspended_by: string;
  suspended_at: string;
  suspension_reason: string;
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

export interface UserPurchaseDetailsResponse {
  id: string;
  user_id: string;
  unit_id: number;
  plan_id: string;
  quantity: string;
  total_price: string;
  initial_payment_due: string;
  balance_due: string;
  payment_method: string;
  status: string;
  start_date: string;
  paid_at: string;
  cancelled_at: string;
  deleted_at: string;
  referral_code: string;
  realtor_history: any[];
  realtor_changed_at: string;
  realtor_change_reason: string;
  createdAt: string;
  updatedAt: string;
  unit: {
    id: number;
    name: string;
    price: string;
    property: {
      id: string;
      name: string;
    };
    unit_type: {
      name: string;
    };
  };
  schedules: [
    {
      id: string;
      purchase_id: string;
      user_id: string;
      amount_due: string;
      amount_paid: string;
      due_date: string;
      status: string;
      payment_ids: string[];
      paid_at: string;
      grace_days: number;
      note: string;
      is_auto_applied: boolean;
      installment_number: number;
      installment_type: string;
      createdAt: string;
      updatedAt: string;
    }
  ];
}
export interface UserPurchasePaymentSchedulesResponse {
  data: [
    {
      id: string
      purchase_id: string
      user_id: string
      installment_number: number;
      installment_type: string
      amount_due: number;
      amount_paid: number;
      outstanding_amount: number;
      due_date: string
      status: string
      payment_ids: string[];
      paid_at: string;
      grace_days: number;
      note: string;
      is_auto_applied: true;
      is_overdue: boolean;
      days_overdue: number;
      createdAt: string
      updatedAt: string
    }
  ];
  summary: {
    totalSchedules: number;
    totalAmountDue: number;
    totalAmountPaid: number;
    remainingBalance: number;
    overdueCount:number;
    overdueAmount:number;
    statusBreakdown: {
      pending: number;
      partial: number;
      paid: number;
      overdue:number;
    };
    nextDueSchedule: {
      id: string
      purchase_id: string
      user_id: string
      installment_number: number;
      installment_type: string
      amount_due: number;
      amount_paid: number;
      outstanding_amount: number;
      due_date: string
      status: string
      payment_ids: string[];
      paid_at: string;
      grace_days: number;
      note: string;
      is_auto_applied: true;
      is_overdue: boolean;
      days_overdue: number;
      createdAt: string
      updatedAt: string
    };
  };
}
export interface ActivityLogsResponse extends IResponse {
  data: Activity[];
}
