import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Metrics, PAGE_SIZE } from 'src/app/core/constants';
import { SharedModule } from 'src/app/shared/shared.module';
import { RealtorService } from 'src/app/core/services/realtor.service';
import { User } from 'src/app/core/models/users';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-realtor-management',
  imports: [CommonModule, SharedModule, NzSelectModule, RouterLink],
  templateUrl: './realtor-management.component.html',
  styleUrls: ['./realtor-management.component.css'],
})
export class RealtorManagementComponent {
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
    {
      key: 'edit',
      label: 'Edit',
      icon: 'edit',
      color: 'green',
      tooltip: 'Edit realtor',
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: 'delete',
      color: 'red',
      tooltip: 'Delete realtor',
    },
  ];

  selectedPeople = signal<User[]>([]);

  constructor(private realtorService: RealtorService) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    this.realtorService.getRealtorUsers(1, PAGE_SIZE, {}).subscribe({
      next: (response) => {
        this.loading = true;
        this.users = response.data.map((user) => ({
          ...user,
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          is_active: user.is_active === true ? 'Active' : 'Inactive',
        }));
        this.loading = false;
      },
      error: (error) => {
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

  onRowClick(row: User) {
    // Navigate to realtor details
    window.location.href = `/main/realtor-management/details/${row.id}`;
  }

  viewRealtor(realtor: User) {
    console.log('Viewing realtor:', realtor);
    window.location.href = `/main/realtor-management/details/${realtor.id}`;
  }

  editRealtor(realtor: User) {
    console.log('Editing realtor:', realtor);
    // Implement edit functionality
  }

  deleteRealtor(realtor: User) {
    console.log('Deleting realtor:', realtor);
    // Implement delete functionality
  }

  handleSelectedData(selected: User[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }
}
