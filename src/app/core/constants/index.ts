import { Person, Metric, PaymentSchedule } from '../types/general';

export const People: Person[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 25 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 29 },
];
export const Metrics: Metric[] = [
  {
    id: 1,
    amount: 120,
    title: 'Total Properties',
    percentage: '14',
    color: '#34A853',
  },
  {
    id: 2,
    amount: 1247,
    title: 'Total Clients',
    percentage: '8.2',
    color: '#FBBC05',
  },
  {
    id: 3,
    amount: 72,
    title: 'Available Properties',
    percentage: '12',
    color: '#E41C24',
  },
  {
    id: 4,
    amount: 51,
    title: 'Active Realtors',
    percentage: '6.5',
    color: '#4D76B8',
  },
  {
    id: 5,
    amount: 89,
    title: 'Pending Subscriptions',
    percentage: '23',
    color: '#FF6B35',
  },
  {
    id: 6,
    amount: 156,
    title: 'Completed Transactions',
    percentage: '18.7',
    color: '#9C27B0',
  },
  {
    id: 7,
    amount: '₦12.4B',
    title: 'Total Revenue',
    percentage: '15.3',
    color: '#00BCD4',
  },
  {
    id: 8,
    amount: '₦2.8B',
    title: 'Monthly Revenue',
    percentage: '11.2',
    color: '#4CAF50',
  },
];

interface Property
  {
    id: number,
    image:string
    name:string
    price:string
    location:string
    quantity:string
    amenities:string
    propertyType:string
    unitType:string
  }


export const Properties: Property[] = [
  {
    id: 1,
    image: 'images/property-image.jpg',
    name: 'Eko Parapo Residence',
    price: '200,000,000',
    location: 'Lagos-Epe Expressway, Abijo, Lagos',
    quantity: '3 Plots Available',
    amenities: 'Electricity, Pipe-borne Water, Tarred Road',
    propertyType: 'Land',
    unitType: 'Plot'
  },
  {
    id: 2,
    image: 'images/property-image.jpg',
    name: 'Eko Parapo Residence',
    price: '200,000,000',
    location: 'Lagos-Epe Expressway, Abijo, Lagos',
    quantity: '3 Plots Available',
    amenities: 'Electricity, Pipe-borne Water, Tarred Road',
    propertyType: 'Land',
    unitType: 'Acres'
  },
];


export const PaymentSchedules: PaymentSchedule[] = [
  {
    currInstallment: '1',
    amount: '300,000,000',
    date: '20-06-2025',
    noOfInstallment: '3',
    status: 'paid',
  },
  {
    currInstallment: '2',
    amount: '300,000,000',
    date: '20-06-2025',
    noOfInstallment: '3',
    status: 'pending',
  },
  {
    currInstallment: '3',
    amount: '300,000,000',
    date: '20-06-2025',
    noOfInstallment: '3',
    status: 'overdue',
  },
];


export const PAGE_SIZE = 10
