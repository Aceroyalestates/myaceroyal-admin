import { Person, Metric, Property } from "../types/general";

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
    amount: 24,
    title: 'Total Client',
    percentage: '14',
    color: '#FBBC05',
  },
  {
    id: 3,
    amount: 72,
    title: 'Available Properties',
    percentage: '14',
    color: '#E41C24',
  },
  {
    id: 4,
    amount: 51,
    title: 'Total Realtors',
    percentage: '14',
    color: '#4D76B8',
  },
];

export const Properties: Property[] = [
  {
    id: 1,
    image: 'images/property-image.jpg',
    name: 'Eko Parapo Residence',
    price: '200,000,000',
    location: 'Lagos-Epe Expressway, Abijo, Lagos',
    quantity: '3 Plots Available',
    amenities: 'Electricity, Pipe-borne Water, Tarred Road',
  },
  {
    id: 2,
    image: 'images/property-image.jpg',
    name: 'Eko Parapo Residence',
    price: '200,000,000',
    location: 'Lagos-Epe Expressway, Abijo, Lagos',
    quantity: '3 Plots Available',
    amenities: 'Electricity, Pipe-borne Water, Tarred Road',
  },
];
