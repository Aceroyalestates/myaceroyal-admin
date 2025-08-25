import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { ColumnDef } from '@tanstack/table-core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentSchedules } from '../../../../core/constants/index';

@Component({
  selector: 'app-view-user-property',
  imports: [CommonModule, SharedModule, NzSelectModule],
  templateUrl: './view-user-property.component.html',
  styleUrls: ['./view-user-property.component.css'],
})
export class ViewUserPropertyComponent {
  userMetrics = Metrics;
  lucy!: string;
  people: Person[] = People;
  paymentSchedules = PaymentSchedules;
  getRowLink = (row: Person) =>
    `/main/user-management/view/${row.id}/${row.name}`;
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
