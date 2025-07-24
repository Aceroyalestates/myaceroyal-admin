import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-admin-management',
  imports: [CommonModule, SharedModule, NzSelectModule, RouterLink],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css'],
})
export class AdminManagementComponent {
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
      tooltip: 'Edit admin'
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      color: 'red',
      tooltip: 'Delete admin'
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
        this.viewAdmin(event.row);
        break;
      case 'edit':
        this.editAdmin(event.row);
        break;
      case 'delete':
        this.deleteAdmin(event.row);
        break;
    }
  }

  onRowClick(row: Person) {
    // Navigate to details page
    window.location.href = `/admin-management/details/${row.id}`;
  }

  viewAdmin(admin: Person) {
    console.log('Viewing admin:', admin);
    // Navigate to details page
    window.location.href = `/admin-management/details/${admin.id}`;
  }

  editAdmin(admin: Person) {
    console.log('Editing admin:', admin);
    // Implement edit functionality
  }

  deleteAdmin(admin: Person) {
    console.log('Deleting admin:', admin);
    // Implement delete functionality
  }

  handleSelectedData(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
