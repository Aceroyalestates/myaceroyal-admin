import { Component, effect, OnInit, signal } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  TableColumn,
} from 'src/app/shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { Metric } from 'src/app/core/types/general';
import { Metrics, PAGE_SIZE } from 'src/app/core/constants';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { User } from 'src/app/core/models/users';
import { DashboardService } from '../../../core/services/dashboard.service';
import { forkJoin } from 'rxjs';
import { Property } from 'src/app/core/models/properties';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SharedModule,
    IconComponent,
    FormsModule,
    NzSelectModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;
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
      key: 'gender',
      title: 'Gender',
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

  metrics: Metric[] = Metrics;
  properties!: Property[];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    forkJoin([
      this.dashboardService.getAdminProperties(1, 2, {}),
      this.dashboardService.getUsers(1, PAGE_SIZE, {}),
    ]).subscribe({
      next: ([response1, response2]) => {
        console.log("This is the perperty response", response1);
        this.properties = response1.data;
        this.users = response2.data.map((user) => ({
          ...user,
          is_active: user.is_active === true ? 'Active' : 'Inactive',
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loading = false;
        this.error = 'Failed to load users';
      },
    });
  }

  getTransparentColor(hex: string): string {
    // Convert HEX to rgba
    if (!hex.startsWith('#')) return hex;

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }
}
