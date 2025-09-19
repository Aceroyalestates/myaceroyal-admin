import { CommonModule } from '@angular/common';
import { Component, effect, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn, TableAction, TableComponent, TableFilter } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule, NzNotificationService, NzNotificationPlacement } from 'ng-zorro-antd/notification';
import { PAGE_SIZE, People } from 'src/app/core/constants';
import { Metric, Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { User } from 'src/app/core/models/users';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { CustomerService, ExportUsersParams } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, SharedModule, NzSelectModule, NzNotificationModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent {
  @ViewChild('userTable') userTable!: TableComponent;
  loading = false;
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
  
  // Current search and filter values
  currentSearchTerm: string = '';
  currentFilters: TableFilter = {};

  constructor(
    private customerService: CustomerService, 
    private router: Router,
    private notification: NzNotificationService
  ) {}

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
        this.showErrorNotification('Failed to load users', 'Please try again later.');
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

  /**
   * Handle search term changes from the table component
   */
  onSearchChange(searchTerm: string) {
    this.currentSearchTerm = searchTerm;
  }

  /**
   * Handle filter changes from the table component
   */
  onFilterChange(filters: TableFilter) {
    this.currentFilters = { ...filters };
  }

  /**
   * Export users data using API with current search and filter parameters
   */
  triggerExport() {
    this.loading = true;
    
    // Prepare export parameters
    const exportParams: ExportUsersParams = {};
    
    // Add search term if present
    if (this.currentSearchTerm.trim()) {
      exportParams.search = this.currentSearchTerm.trim();
    }
    
    // Add role filter if present (assuming there's a role filter in the table)
    if (this.currentFilters['role']) {
      exportParams.role = this.currentFilters['role'];
    }
    
    // Add role_id filter if present
    if (this.currentFilters['role_id']) {
      exportParams.role_id = this.currentFilters['role_id'];
    }

    // Debug: Log export parameters
    console.log('Exporting users with parameters:', exportParams);

    this.customerService.exportUsers(exportParams).subscribe({
      next: (blob: Blob) => {
        this.handleFileDownload(blob);
        this.loading = false;
      },
      error: (error) => {
        console.error('Export failed:', error);
        this.showErrorNotification('Export Failed', 'Failed to export users data. Please try again.');
        this.loading = false;
      },
    });
  }

  /**
   * Handle file download from blob response
   */
  private handleFileDownload(blob: Blob) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    link.download = `users-export-${timestamp}.csv`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    
    // Show success message
    this.showSuccessNotification('Export Successful', 'Users data has been exported successfully.');
  }

  /**
   * Show success notification
   */
  private showSuccessNotification(title: string, message: string): void {
    this.notification.success(
      title,
      message,
      { 
        nzPlacement: 'topRight',
        nzDuration: 4000
      }
    );
  }

  /**
   * Show error notification
   */
  private showErrorNotification(title: string, message: string): void {
    this.notification.error(
      title,
      message,
      { 
        nzPlacement: 'topRight',
        nzDuration: 6000
      }
    );
  }
}
