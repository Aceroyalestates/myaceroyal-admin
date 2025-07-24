import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-admin-details',
  imports: [CommonModule, SharedModule, NzSelectModule],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.css',
})
export class AdminDetailsComponent {
  userMetrics = Metrics;
  lucy!: string;
  role!: string;
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
      tooltip: 'Edit user'
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
        this.viewUser(event.row);
        break;
      case 'edit':
        this.editUser(event.row);
        break;
    }
  }

  onRowClick(row: Person) {
    // Navigate to user details
    window.location.href = `/user-management/view/${row.id}/${row.name}`;
  }

  viewUser(user: Person) {
    console.log('Viewing user:', user);
    window.location.href = `/user-management/view/${user.id}/${user.name}`;
  }

  editUser(user: Person) {
    console.log('Editing user:', user);
    // Implement edit functionality
  }

  handleSelectedData(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
