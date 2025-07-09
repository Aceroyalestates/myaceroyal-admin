import { Component, effect, signal } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ColumnDef } from '@tanstack/table-core';
import { CommonModule } from '@angular/common';

interface Person {
  id: number;
  name: string;
  email: string;
  age: number;
}
interface Metric {
  id: number;
  title: string;
  percentage: string;
  amount: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  people: Person[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 25 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 29 },
  ];

  columns: ColumnDef<Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'age', header: 'Age' },
  ];

  selectedPeople = signal<Person[]>([]);
  metrics: Metric[] = [
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
  constructor() {
    // Optional effect to react to selected people changes
    effect(() => {
      console.log('Selected people from table:', this.selectedPeople());
    });
  }

  handleSelectedData(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
  getTransparentColor(hex: string): string {
    // Convert HEX to rgba
    if (!hex.startsWith('#')) return hex;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }
}
