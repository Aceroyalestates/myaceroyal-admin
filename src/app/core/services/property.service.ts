import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';
import { Property, PropertyResponse, PropertyUpdateResponse } from '../models/properties';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private httpService: HttpService) {}

  //  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcwODlkMzA2LTc2ZWMtNGU1ZC1iMmI4LTE0NWQyYjlkOTJjZSIsInJvbGVfaWQiOjEsImlhdCI6MTc1NDUxMTUzMSwiZXhwIjoxNzU0NTk3OTMxfQ.jZ4ry1d6OCKYbFj7U04R2g9tfGTstadgqYuls2AUur4' \
//set the headers in the HttpService
  

  getProperties(page: number = 1, limit: number = 10, filters?: any): Observable<PropertyResponse> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };
    return this.httpService.get<PropertyResponse>('properties', params);
  }

  getPropertyById(id: string): Observable<Property> {
    return this.httpService.get<{ data: Property }>(`properties/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  createProperty(property: Partial<Property>): Observable<Property> {
    return this.httpService.post<{ data: Property }>('properties', property)
      .pipe(
        map(response => response.data)
      );
  }

  updateProperty(id: string, property: Partial<Property>): Observable<PropertyUpdateResponse> {
    return this.httpService.put<PropertyUpdateResponse>(`admin/properties/${id}`, property)
      .pipe(
        map(response => response)
      );
  }

  patchProperty(id: string, property: Partial<Property>): Observable<Property> {
    return this.httpService.patch<{ data: Property }>(`properties/${id}`, property)
      .pipe(
        map(response => response.data)
      );
  }

  deleteProperty(id: string): Observable<void> {
    return this.httpService.delete<void>(`properties/${id}`);
  }
}
