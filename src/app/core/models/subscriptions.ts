import { IResponse, Pagination } from './generic';

export interface GetFormsParams {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string; // Admin only
  search?: string;
  fromDate?: string; // yyyy-mm-dd
  toDate?: string;   // yyyy-mm-dd
  sortBy?: string;   // e.g. created_at
  sortOrder?: 'ASC' | 'DESC';
}

export interface FormsListResponse extends IResponse {
  data?: any[];
  pagination?: Pagination;
}

export type ExportFormat = 'csv' | 'json';

export interface ExportFormsParams extends Omit<GetFormsParams, 'page' | 'limit' | 'sortBy' | 'sortOrder'> {
  format?: ExportFormat; // csv or json
}

export interface IncompleteReminderRequest {
  userIds?: string[];
  formStatuses?: string[]; // e.g. ['draft','in_progress']
  daysSinceCreated?: number;
  daysSinceLastUpdate?: number;
  dryRun?: boolean;
}

