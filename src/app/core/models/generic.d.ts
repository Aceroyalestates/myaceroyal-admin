// can i put any datatype as the default type for a generic interface?
export interface IResponse<T = any> {
  success?: boolean;
  message: string;
  pagination?: Pagination;
  data?: T;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Activity {
  id: number;
  user_id: string;
  role_id: number;
  action: string;
  description: string;
  entity_type: string;
  entity_id: string;
  ip_address: string;
  user_agent: string;
  metadata: {
    plan_id: number;
    quantity: number;
    amount_paid: number;
  };
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    id: string;
    full_name: string;
    role_id: number;
    role: {
      name: string;
    };
  };
}

export interface Role {
  value: number;
  label: string;
  name: string;
}
