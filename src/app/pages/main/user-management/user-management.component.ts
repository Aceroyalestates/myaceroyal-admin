import { CommonModule } from '@angular/common';
import { Component, effect, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn, TableAction, TableComponent } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PAGE_SIZE, People } from 'src/app/core/constants';
import { Metric, Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { User } from 'src/app/core/models/users';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CustomerService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, SharedModule, NzSelectModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent {
  @ViewChild('userTable') userTable!: TableComponent;
  loading = false;
  error: string | null = null;
  userMetrics: Metric[] = [];
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

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers()
  }
  loadUsers() {
    this.loading = true;
    this.customerService.getCustomerUsers(1, PAGE_SIZE, {}).subscribe({
      next: (response) => {
        // Preprocess users and preserve booleans for metrics
        this.users = response.data.map((user: any) => ({
          ...user,
          active_bool: user.is_account_locked === true,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          is_active: user.is_account_locked === true ? 'Inactive' : 'Active'
        } as any));
          this.loading = false;
        this.updateUserMetrics();
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load users';
      },
    });
  }

  private updateUserMetrics() {
    const total = this.users?.length || 0;
    const active = this.users?.filter((u: any) => u.active_bool === true).length || 0;
    const verified = this.users?.filter((u: any) => u.is_verified === true).length || 0;
    const suspended = this.users?.filter((u: any) => u.is_account_locked === true || !!u.suspended_at).length || 0;

    this.userMetrics = [
      { id: 1, title: 'Total Customers', amount: total, percentage: '0', color: '#4D76B8' },
      { id: 2, title: 'Active Customers', amount: active, percentage: '0', color: '#10B981' },
      { id: 3, title: 'Verified Customers', amount: verified, percentage: '0', color: '#34A853' },
      { id: 4, title: 'Suspended Accounts', amount: suspended, percentage: '0', color: '#E41C24' }
    ];
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
    this.router.navigate(['/main/user-management/view', row.id]);
  }

  viewUser(user: User) {
    console.log('Viewing user:', user);
    this.router.navigate(['/main/user-management/view', user.id]);
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

  triggerExport() {
    if (this.userTable) {
      this.userTable.triggerExport();
    } else {
      console.warn('Table component not found');
    }
  }
}
