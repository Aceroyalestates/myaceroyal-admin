import { IResponse, Pagination } from './generic';

export interface PropertyResponse extends IResponse {
  data: Property[];
  pagination: Pagination;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  description: string;
  type_id: number;
  location: string;
  address: string;
  listed_by: string;
  is_available: boolean;
  vr_link: string;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  property_type: PropertyType;
  property_images: PropertyImage[];
  property_units: PropertyUnit[];
  property_features: PropertyFeature[];
}

export interface PropertyType {
  name: string;
}

export interface PropertyImage {
  image_url: string;
  is_cover: boolean | null;
}

export interface PropertyUnit {
  id: number;
  name: string | null;
  unit_type_id: number;
  price: string;
  total_units: number;
  units_sold: number;
  is_sold_out: boolean;
  unit_type: UnitType;
  property_installment_plans: PropertyInstallmentPlan[];
}

export interface UnitType {
  name: string;
}

export interface PropertyInstallmentPlan {
  id: number;
  plan_id: number;
  initial_amount: string;
  total_price: string;
  start_date: string;
  is_active: boolean;
  property_plan: PropertyPlan;
}

export interface PropertyPlan {
  title: string;
}

export interface PropertyFeature {
  feature_id: number;
  feature: {
    name: string;
  };
}

export interface PropertyUpdateResponse {
  message: string;
  property: Property;
}

export interface PropertyTypeOptions {
  value: number;
  label: string;
  name: string;
}

// {
//       "id": 1,
//       "name": "Swimming Pool",
//       "icon": "fa-swimming-pool"
//     }

export interface PropertyFeatureAdmin {
  id: number;
  name: string;
  icon: string;
}