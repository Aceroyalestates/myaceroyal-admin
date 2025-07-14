export interface Person {
  id: number;
  name: string;
  email: string;
  age: number;
}
export interface Metric {
  id: number;
  title: string;
  percentage: string;
  amount: number;
  color: string;
}

export interface Property {
  id: number;
  name: string;
  image: string;
  location: string;
  amenities: string;
  price: string;
  quantity: string;
  propertyType?: string;
  unitType?: string
}

export interface PaymentSchedule {
  currInstallment: string;
  noOfInstallment: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: string;
  date: string;
}
