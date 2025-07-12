import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { ColumnDef } from '@tanstack/table-core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-realtor-management',
  imports: [CommonModule, SharedModule, NzSelectModule],
  templateUrl: './realtor-management.component.html',
  styleUrls: ['./realtor-management.component.css'],
})
export class RealtorManagementComponent {
  userMetrics = Metrics;
  lucy!: string;
  people: Person[] = People;
  getRowLink = (row: Person) => `/realtor-management/details/${row.id}`;
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
