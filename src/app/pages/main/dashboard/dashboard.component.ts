import { Component, effect, OnInit, signal } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  TableAction,
  TableColumn,
} from 'src/app/shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { IconComponent } from 'src/app/shared/components/icon/icon.component';
import { Metric } from 'src/app/core/types/general';
import { Metrics, PAGE_SIZE } from 'src/app/core/constants';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { DashboardService } from '../../../core/services/dashboard.service';
import { forkJoin } from 'rxjs';
import { Property } from 'src/app/core/models/properties';
import { Activity } from 'src/app/core/models/generic';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SharedModule,
    IconComponent,
    FormsModule,
    NzSelectModule,
    PaymentDetailsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  loading = false;
  error: string | null = null;
  activities!: Activity[];
  lucy!: string;
  columns: TableColumn[] = [
    {
      key: 'full_name',
      title: 'Name',
      sortable: true,
      type: 'text',
    },
    {
      key: 'action',
      title: 'Activity',
      sortable: false,
      type: 'text',
    },
    {
      key: 'date',
      title: 'Date',
      sortable: true,
      type: 'text',
    },
    // {
    //   key: 'is_active',
    //   title: 'Status',
    //   sortable: true,
    //   type: 'status',
    // },
  ];
   actions: TableAction[] = [
      {
        key: 'view',
        label: 'View',
        icon: 'eye',
        color: 'red',
        tooltip: 'View details',
      },
    ];


  metrics: Metric[] = Metrics;
  properties!: Property[];
  isVisible = false
  activity: Activity = {} as Activity;
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    forkJoin([
      this.dashboardService.getAdminProperties(1, 2, {}),
      this.dashboardService.getActivityLogs(1, PAGE_SIZE, {}),
    ]).subscribe({
      next: ([response1, response2]) => {
        console.log('This is the perperty response', response1.data);
        this.properties = response1.data;
        this.activities = response2.data.map((activity) => ({
          ...activity,
          full_name: activity.user.full_name,
          date: new Date(activity.createdAt).toLocaleDateString(),
          // is_active: user.is_active === true ? 'Active' : 'Inactive',
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
  onTableAction(event: { action: string; row: Activity }) {
    console.log('Table action:', event.action, 'Row:', event.row);
    switch (event.action) {
      case 'view':
        this.viewUser(event.row);
        break;
    }
  }
    onRowClick(row: Activity) {
      // Navigate to user details
      window.location.href = `/main/user-management/view/${row.id}/${row.user.full_name}`;
    }

    viewUser(activity: Activity) {
      console.log('Viewing activity:', activity);
      this.isVisible=true;
      this.activity=activity
      console.log('This is the id', this.activity);
    }

    handleAccountDetailsClose() {
      this.isVisible=false;
    }
}
