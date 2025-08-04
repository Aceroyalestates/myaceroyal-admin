export interface IResponse {
  success: boolean;
  message: string;
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
