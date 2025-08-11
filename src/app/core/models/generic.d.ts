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
