import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PAGE_SIZE } from 'src/app/core/constants';
import { Metric } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { User } from 'src/app/core/models/users';
import { AdminService } from 'src/app/core/services/admin.service';

@Component({
  selector: 'app-admin-management',
  imports: [CommonModule, SharedModule, NzSelectModule, RouterLink],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.css'],
})
export class AdminManagementComponent implements OnInit {
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

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers()
  }
  loadUsers() {
    this.loading = true;
    this.adminService.getAdminUsers(1, PAGE_SIZE, {}).subscribe({
      next: (response) => {
        // Preprocess users to add unit_type_name
        this.users = response.data.map((user: any) => ({
          ...user,
          active_bool: user.is_active === true,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          is_active: user.is_active === true ? 'Active' : 'Inactive',
        }));
        this.loading = false;
        this.updateAdminMetrics();
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load users';
      },
    });
  }

  private updateAdminMetrics() {
    const total = this.users?.length || 0;
    const active = this.users?.filter((u: any) => u.active_bool === true).length || 0;
    const superAdmins = this.users?.filter((u: any) => u.role?.label?.toLowerCase().includes('super')).length || 0;
    const suspended = this.users?.filter((u: any) => u.is_account_locked === true || !!u.suspended_at).length || 0;

    this.userMetrics = [
      { id: 1, title: 'Total Admins', amount: total, percentage: '0', color: '#4D76B8' },
      { id: 2, title: 'Active Admins', amount: active, percentage: '0', color: '#10B981' },
      { id: 3, title: 'Super Admins', amount: superAdmins, percentage: '0', color: '#3B82F6' },
      { id: 4, title: 'Suspended Admins', amount: suspended, percentage: '0', color: '#E41C24' }
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

  onRowClick(row: User) {
    // Navigate to details page
    window.location.href = `/main/admin-management/details/${row.id}`;
  }

  viewAdmin(admin: User) {
    console.log('Viewing admin:', admin);
    // Navigate to details page
    window.location.href = `/main/admin-management/details/${admin.id}`;
  }

  editAdmin(admin: User) {
    console.log('Editing admin:', admin);
    // Implement edit functionality
  }

  deleteAdmin(admin: User) {
    console.log('Deleting admin:', admin);
    // Implement delete functionality
  }

  handleSelectedData(selected: User[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
