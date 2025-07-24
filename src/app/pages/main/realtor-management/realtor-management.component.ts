import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
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
  
  columns: TableColumn[] = [
    { 
      key: 'name', 
      title: 'Name',
      sortable: true,
      type: 'text'
    },
    { 
      key: 'email', 
      title: 'Email',
      sortable: true,
      type: 'text'
    },
    { 
      key: 'age', 
      title: 'Age',
      sortable: true,
      type: 'text'
    },
  ];

  actions: TableAction[] = [
    {
      key: 'view',
      label: 'View',
      icon: 'eye',
      color: 'blue',
      tooltip: 'View details'
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: 'edit',
      color: 'green',
      tooltip: 'Edit realtor'
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      color: 'red',
      tooltip: 'Delete realtor'
    }
  ];

  selectedPeople = signal<Person[]>([]);

  constructor() {
    // Optional effect to react to selected people changes
    effect(() => {
      console.log('Selected people from table:', this.selectedPeople());
    });
  }

  onSelectionChange(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log('Selected people:', this.selectedPeople());
  }

  onTableAction(event: { action: string; row: Person }) {
    console.log('Table action:', event.action, 'Row:', event.row);
    switch (event.action) {
      case 'view':
        this.viewRealtor(event.row);
        break;
      case 'edit':
        this.editRealtor(event.row);
        break;
      case 'delete':
        this.deleteRealtor(event.row);
        break;
    }
  }

  onRowClick(row: Person) {
    // Navigate to realtor details
    window.location.href = `/realtor-management/details/${row.id}`;
  }

  viewRealtor(realtor: Person) {
    console.log('Viewing realtor:', realtor);
    window.location.href = `/realtor-management/details/${realtor.id}`;
  }

  editRealtor(realtor: Person) {
    console.log('Editing realtor:', realtor);
    // Implement edit functionality
  }

  deleteRealtor(realtor: Person) {
    console.log('Deleting realtor:', realtor);
    // Implement delete functionality
  }

  handleSelectedData(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
