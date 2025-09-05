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

export interface PropertyImage {
  id: number;
  image_url: string;
  is_cover: boolean | null;
}

export interface PropertyUnit {
  id: number;
  name: string | null;
  price: string;
  is_available: boolean;
  unit_type: UnitType;
  property_installment_plans: PropertyInstallmentPlan[];
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

export interface PropertyType {
    id: number;
    name: string;
    label: string | null;
    deleted_at: string | null;
    createdAt: string;
    updatedAt: string;
    properties: Partial<Property>[];
}

export interface PropertyFeatureAdmin {
  id: number;
  name: string;
  icon: string;
}

export interface UnitType {
  id: number;
  name: string;
  type_id: string;
  label: string | null;
  default_size: string | null;
}

export interface PropertyCreateRequest {
    name: string;
    description: string;
    type_id: number;
    location: string;
    address?: string;
    vr_link?: string;
    property_images?: PropertyImage[];
    features: number[];
    property_units?: PropertyUnitCreate[];
    payment_plans?: InstallmentPlanCreate[];
}
export interface PropertyUnitRequest {
  unit_types: PropertyUnitCreate[];
}

interface PropertyUnitCreate {
    unit_type_id: number;
    price: string;
    total_units: number;
}

interface InstallmentPlanCreate {
    unit_id: string;
    plan_id: string;
    initial_amount: string;
    total_price: string;
    start_date: string;
}

export interface FeatureRequest {
    features: number[];
}