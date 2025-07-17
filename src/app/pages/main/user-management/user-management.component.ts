import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { ColumnDef } from '@tanstack/angular-table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, SharedModule, NzSelectModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent {
  userMetrics = Metrics;
  lucy!: string;
  people: Person[] = People;
  getRowLink = (row: Person) => `/user-management/view/${row.id}`;
  columns: ColumnDef<Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'age', header: 'Age' },
  ];

  selectedPeople = signal<Person[]>([]);

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
}
