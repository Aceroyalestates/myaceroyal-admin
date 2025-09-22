import { IResponse, Pagination } from './generic';

export interface Client {
	id: string;
	name: string;
	email: string;
	phone: string;
	purchases: number;
	total: string;
	createdAt?: string;
	updatedAt?: string;
	// Allow additional backend-provided fields
	[key: string]: any;
}

export interface ClientsResponse extends IResponse {
	data: Client[];
	pagination: Pagination;
}

export interface ClientResponse extends IResponse<Client> {
	data: Client;
}

export interface ClientListParams {
	page?: number;
	limit?: number;
	sort_by?: string;   // e.g. createdAt, name, total
	sort_order?: 'ASC' | 'DESC';
	search?: string;    // Search by name, email, or phone
	realtorId?: string;
}
