import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';
import { FeatureRequest, Property, PropertyCreateRequest, PropertyFeatureAdmin, PropertyResponse, PropertyType, PropertyTypeOptions, PropertyUnitRequest, UnitType } from '../models/properties';
import { IResponse } from '../models/generic';

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

  createProperty(property: Partial<PropertyCreateRequest>): Observable<IResponse<Property>> {
    return this.httpService.post<IResponse<Property>>('admin/properties', property);
  }

  updateProperty(id: string, property: Partial<PropertyCreateRequest>): Observable<IResponse<Property>> {
    return this.httpService.put<IResponse<Property>>(`admin/properties/${id}`, property);
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

  addImagesToProperty(propertyId: string, data: any): Observable<IResponse<Property>> {
    return this.httpService.post<IResponse<Property>>(`admin/properties/${propertyId}/images`, data);
  }


  deleteImage(propertyId: string, imageId: number): Observable<{ success?: boolean; message: string }> {
    return this.httpService.delete<{ success?: boolean; message: string }>(`admin/properties/${propertyId}/images/${imageId}`);
  }

  getPropertytypesOptions(): Observable<IResponse<PropertyTypeOptions[]>> {
    return this.httpService.get<IResponse<PropertyTypeOptions[]>>('property-types/dropdown/options')
      .pipe(
        map(response => response)
      );
  }

  getPropertyFeatures(): Observable<IResponse<PropertyFeatureAdmin[]>> {
    return this.httpService.get<IResponse<PropertyFeatureAdmin[]>>('admin/features')
      .pipe(
        map(response => response)
      );
  }

  getPropertyTypes(page: number = 1, limit: number = 10, filters?: any): Observable<IResponse<PropertyType[]>> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    };
    return this.httpService.get<IResponse<PropertyType[]>>('property-types', params);
  }

  getUnitTypes(): Observable<IResponse<UnitType[]>> {
    return this.httpService.get<IResponse<UnitType[]>>('admin/unit-types');
  }

  updateFeatures(propertyId: string, features: FeatureRequest): Observable<IResponse>{
    return this.httpService.post<IResponse>(`admin/properties/${propertyId}/features`, features);
  }

  toggleAvailability(propertyId: string): Observable<IResponse> {
    return this.httpService.patch<IResponse>(`admin/properties/${propertyId}/toggle-availability`, {});
  }

  getInstallmentPlans(): Observable<IResponse<any[]>> {
    return this.httpService.get<IResponse<any[]>>('admin/installment-plans');
  }

  addPropertyUnit(propertyId: string, unit: PropertyUnitRequest): Observable<IResponse<Property>> {
    return this.httpService.post<IResponse<Property>>(`admin/properties/${propertyId}/units`, unit);
  }

}
