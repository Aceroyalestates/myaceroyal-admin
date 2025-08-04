export interface PropertyResponse {
  success: boolean;
  message: string;
  data: Property[];
  pagination: Pagination;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  address: string;
  is_available: boolean;
  vr_link: string;
  createdAt: string;
  updatedAt: string;
  property_type: PropertyType;
  property_images: PropertyImage[];
  property_units: PropertyUnit[];
  property_features: PropertyFeature[];
}

export interface PropertyType {
  id: number;
  name: string;
}

export interface PropertyImage {
  id: string;
  image_url: string;
  is_cover: boolean;
  alt_text: string;
}

export interface PropertyUnit {
  id: string;
  name: string;
  price: string;
  is_available: boolean;
  unit_type: UnitType;
  is_sold_out: boolean;
  total_units: number;
  unit_type_id: number;
  unit_sold: number;
  property_installment_plans: PropertyInstallmentPlan[];
}

export interface PropertyInstallmentPlan {
  id: number;
  initial_amount: string;
  is_active: boolean;
  plan_id: number;
  property_plan: PropertyPlan;
  start_date: string;
  total_price: string;
}

export interface UnitType {
  id: number;
  name: string;
  default_size: string;
}

export interface PropertyFeature {
feature_id: number;
  feature: Feature;
}

export interface Feature {
    name: string;
}
export interface PropertyPlan {
  title: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Example of a property installment plan

// property_installment_plans
// : 
// Array(1)
// 0
// : 
// id
// : 
// 11
// initial_amount
// : 
// "8000000"
// is_active
// : 
// true
// plan_id
// : 
// 1
// property_plan
// : 
// {title: '3 months'}
// start_date
// : 
// "2025-07-23T00:00:00.000Z"
// total_price
// : 
// "30000000"