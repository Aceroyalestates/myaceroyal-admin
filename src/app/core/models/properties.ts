import { IResponse, Pagination } from './generic';

export interface PropertyResponse extends IResponse {
  data: Property[];
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
}

export interface UnitType {
  id: number;
  name: string;
  default_size: string;
}

export interface PropertyFeature {
  id: number;
  name: string;
  icon: string;
  feature_id: string;
  feature: {
    name: string
  };
}
