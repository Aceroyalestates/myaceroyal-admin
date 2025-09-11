import { IResponse, Pagination } from './generic';

export interface FinanceUser {
  full_name?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

export interface FinancePropertyRef {
  name?: string;
  [key: string]: any;
}

export interface FinanceTransaction {
  id: string;
  purchase_id?: string;
  user_id?: string;
  method?: string; // e.g. bank_transfer, paystack, cheque
  status?: string; // e.g. pending, approved, rejected, review
  amount?: number | string;
  createdAt?: string;
  updatedAt?: string;
  // Common fields observed in UI mappings
  payment_type?: string;
  type?: string;
  user?: FinanceUser;
  customer_name?: string;
  client?: string;
  mode?: string;
  property?: FinancePropertyRef;
  reference?: string;
  ref?: string;
  description?: string;
  fee?: number | string;
  net_amount?: number | string;
  evidence_url?: string;
  receipt_url?: string;
  // Allow additional backend-provided fields
  [key: string]: any;
}

export interface FinanceTransactionListResponse extends IResponse {
  data: FinanceTransaction[];
  pagination: Pagination;
}

export interface FinanceTransactionResponse extends IResponse<FinanceTransaction> {
  data: FinanceTransaction;
}

export interface TransactionListParams {
  status?: string;
  method?: string;
  purchase_id?: string;
  user_id?: string;
  from_date?: string; // yyyy-mm-dd
  to_date?: string;   // yyyy-mm-dd
  page?: number;
  limit?: number;
  sort_by?: string;   // e.g. createdAt
  sort_order?: 'ASC' | 'DESC';
}

export interface UpdateTransactionRequest {
  action: 'approve' | 'review' | 'reject' | 'request_reupload' | string;
  comment?: string;
  reason?: string;
  message?: string;
}

// UI-level models for finance management screens
export interface FinanceMetric {
  id: number;
  title: string;
  amount: string;
  percentage: string;
  trend: 'up' | 'down';
  color: string;
}

export interface Transaction {
  id: string;
  paymentType: string;
  client: string;
  property?: string;
  modeOfPayment: string;
  amount: string;
  status: 'Pending' | 'Approved' | 'Under Review' | 'Failed' | string;
  action?: string;
}
