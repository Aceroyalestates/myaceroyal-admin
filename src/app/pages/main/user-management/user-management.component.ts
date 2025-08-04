import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, PAGE_SIZE, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { User } from 'src/app/core/models/users';
import { DashboardService } from 'src/app/core/services/dashboard.service';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, SharedModule, NzSelectModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent {
  loading = false;
  error: string | null = null;
  userMetrics = Metrics;
  users!: User[];
  lucy!: string;
  columns: TableColumn[] = [
    {
      key: 'full_name',
      title: 'Name',
      sortable: true,
      type: 'text',
    },
    {
      key: 'email',
      title: 'Email Address',
      sortable: true,
      type: 'text',
    },
    {
      key: 'phone_number',
      title: 'Phone Number',
      sortable: true,
      type: 'text',
    },
    {
      key: 'gender',
      title: 'Gender',
      sortable: true,
      type: 'text',
    },
    {
      key: 'createdAt',
      title: 'Date',
      sortable: true,
      type: 'text',
    },
    {
      key: 'is_active',
      title: 'Status',
      sortable: true,
      type: 'status',
    },
  ];

  actions: TableAction[] = [
    {
      key: 'view',
      label: 'View',
      icon: 'eye',
      color: 'blue',
      tooltip: 'View details',
    },
  ];

  selectedPeople = signal<User[]>([]);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadUsers()
  }
  loadUsers() {
    this.dashboardService.getUsers(1, PAGE_SIZE, {}).subscribe({
      next: (response) => {
        // Preprocess users to add unit_type_name
        this.users = response.data.map(user => ({
          ...user,
          is_active: user.is_active === true?"Active":"Inactive"
        }));
        this.loading = false;
        console.log(this.users); // Property array
        console.log(response.pagination); // Pagination info
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
        this.error = 'Failed to load users';
      },
    });
  }

  onSelectionChange(selected: User[]) {
    this.selectedPeople.set(selected);
    console.log('Selected people:', this.selectedPeople());
  }

  onTableAction(event: { action: string; row: User }) {
    console.log('Table action:', event.action, 'Row:', event.row);
    switch (event.action) {
      case 'view':
        this.viewUser(event.row);
        break;
      case 'edit':
        this.editUser(event.row);
        break;
      case 'delete':
        this.deleteUser(event.row);
        break;
    }
  }

  onRowClick(row: User) {
    window.location.href = `/user-management/view/${row.id}`;
  }

  viewUser(user: User) {
    console.log('Viewing user:', user);
    window.location.href = `/user-management/view/${user.id}`;
  }

  editUser(user: User) {
    console.log('Editing user:', user);
  }

  deleteUser(user: User) {
    console.log('Deleting user:', user);
  }

  handleSelectedData(selected: User[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
