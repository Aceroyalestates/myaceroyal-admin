import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';
import { Property, PropertyResponse } from '../models/properties';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private httpService: HttpService) {}

  /**
   * Get properties with pagination
   * @param page Page number
   * @param limit Items per page
   * @param filters Optional filters for properties
   */
  getProperties(page: number = 1, limit: number = 10, filters?: any): Observable<PropertyResponse> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };
    return this.httpService.get<PropertyResponse>('properties', params);
  }

  /**
   * Get single property by ID
   * @param id Property ID
   */
  getPropertyById(id: string): Observable<Property> {
    return this.httpService.get<{ data: Property }>(`properties/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Create a new property
   * @param property Property data to create
   */
  createProperty(property: Partial<Property>): Observable<Property> {
    return this.httpService.post<{ data: Property }>('properties', property)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Update existing property
   * @param id Property ID
   * @param property Property data to update
   */
  updateProperty(id: string, property: Partial<Property>): Observable<Property> {
    return this.httpService.put<{ data: Property }>(`properties/${id}`, property)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Partially update existing property
   * @param id Property ID
   * @param property Partial property data to update
   */
  patchProperty(id: string, property: Partial<Property>): Observable<Property> {
    return this.httpService.patch<{ data: Property }>(`properties/${id}`, property)
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Delete a property
   * @param id Property ID
   */
  deleteProperty(id: string): Observable<void> {
    return this.httpService.delete<void>(`properties/${id}`);
  }
}
