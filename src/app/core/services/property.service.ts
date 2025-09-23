import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, Observable } from 'rxjs';
import { FeatureRequest, InstallmentPlan, InstallmentPlanCreate, InstallmentPlanRequest, Property, PropertyCreateRequest, PropertyFeatureAdmin, PropertyResponse, PropertyType, PropertyTypeOptions, PropertyUnit, PropertyUnitCreate, PropertyUnitRequest, TogglePropertyAvailabilityResponse, UnitType } from '../models/properties';
import { IResponse } from '../models/generic';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private httpService: HttpService) {}

  // getProperties(page: number = 2, limit: number = 10, filters?: any): Observable<PropertyResponse> {
  //   const params = {
  //     page: page.toString(),
  //     limit: limit.toString(),
  //     ...filters
  //   };
  //   return this.httpService.get<PropertyResponse>('admin/properties', params);
  // }

  getProperties(page: number = 1, limit: number = 10, filters?: any): Observable<PropertyResponse> {
    // Map filter keys to match backend expectations (if needed)
    // const params = {
    //   page: page,
    //   limit: limit.toString(),
    //   // Map 'search' to 'q' if backend expects 'q' for search
    //   q: filters?.search || '',
    //   status: filters?.status || '',
    //   property_type: filters?.['property_type.name'] || '',
    //   sort_by: filters?.sort_by || '',
    //   sort_order: filters?.sort_order || '',
    //   is_available: filters?.is_available !== undefined ? filters.is_available.toString() : ''
    // };

    // Remove empty params to avoid unnecessary query parameters
    // const cleanedParams = Object.fromEntries(
    //   Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined)
    // );

    return this.httpService.get<PropertyResponse>(`admin/properties?page=${page}&limit=${limit}`, filters);
  }

  getPropertyById(id: string): Observable<Property> {
    return this.httpService.get<{ data: Property }>(`admin/properties/${id}`)
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
    return this.httpService.patch<{ data: Property }>(`admin/properties/${id}`, property)
      .pipe(
        map(response => response.data)
      );
  }

  deleteProperty(id: string): Observable<void> {
    return this.httpService.delete<void>(`admin/properties/${id}`);
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

  toggleAvailability(propertyId: string): Observable<TogglePropertyAvailabilityResponse> {
    return this.httpService.patch<TogglePropertyAvailabilityResponse>(`admin/properties/${propertyId}/toggle-availability`, {});
  }

  getInstallmentPlans(): Observable<IResponse<InstallmentPlan[]>> {
    return this.httpService.get<IResponse<InstallmentPlan[]>>('admin/installment-plans');
  }

  addPropertyUnit(propertyId: string, unit: PropertyUnitRequest): Observable<IResponse<Partial<PropertyUnit>>> {
    return this.httpService.post<IResponse<Partial<PropertyUnit>>>(`admin/properties/${propertyId}/units`, unit);
  }

  deletePropertyUnit(propertyId: string, unitId: number): Observable<IResponse<Property>> {
    return this.httpService.delete<IResponse<Property>>(`admin/properties/${propertyId}/units/${unitId}`);
  }

  updatePropertyUnit(propertyId: string, unitId: number, unit: Partial<PropertyUnitCreate>): Observable<IResponse<Property>> {
    return this.httpService.put<IResponse<Property>>(`admin/properties/${propertyId}/units/${unitId}`, unit);
  }

  addPropertyInstallmentPlans(propertyId: string, plans: InstallmentPlanRequest): Observable<IResponse<Property>> {
    return this.httpService.post<IResponse<Property>>(`admin/properties/${propertyId}/installment-plans`,  plans);
  }

  addInstallmentPlanToUnit(propertyId: string, unitId: number, plan: InstallmentPlanRequest): Observable<IResponse<Property>> {
    return this.httpService.post<IResponse<Property>>(`admin/properties/${propertyId}/units/${unitId}/installment-plans`, plan);
  }

  deleteInstallmentPlanFromUnit(propertyId: string, planId: number): Observable<IResponse<Property>> {
    return this.httpService.delete<IResponse<Property>>(`admin/properties/${propertyId}/installment-plans/${planId}`);
  }

  updateInstallmentPlanOfUnit(propertyId: string, planId: number, plan: Partial<InstallmentPlanCreate>): Observable<IResponse<Property>> {
    return this.httpService.put<IResponse<Property>>(`admin/properties/${propertyId}/installment-plans/${planId}`, plan);
  }

}
