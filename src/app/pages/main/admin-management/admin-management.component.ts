import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, PAGE_SIZE } from 'src/app/core/constants';
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

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers()
  }
  loadUsers() {
    this.adminService.getAdminUsers(1, PAGE_SIZE, {}).subscribe({
      next: (response) => {
        // Preprocess users to add unit_type_name
        this.users = response.data.map((user) => ({
          ...user,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          is_active: user.is_active === true ? 'Active' : 'Inactive',
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
