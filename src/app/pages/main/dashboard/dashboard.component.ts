import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardAnalyticsService, DashboardKpis, TimeRangeFilters } from 'src/app/core/services/dashboard-analytics.service';
import { DashboardFiltersService } from 'src/app/core/services/dashboard-filters.service';
import { MockDataService } from 'src/app/core/services/mock-data.service';
import { environment } from 'src/environments/environment';
import { forkJoin, Subscription } from 'rxjs';
import { Property } from 'src/app/core/models/properties';
import { Activity } from 'src/app/core/models/generic';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import Chart from 'chart.js/auto';
import { ThemeService } from 'src/app/core/services/theme.service';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    SharedModule,
    IconComponent,
    FormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCardModule,
    NzTabsModule,
    SearchBarComponent,
    PaymentDetailsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
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
  // Charts
  @ViewChild('revenueChart', { static: false }) revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('paymentsChart', { static: false }) paymentsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('propertiesChart', { static: false }) propertiesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('realtorsChart', { static: false }) realtorsChartRef!: ElementRef<HTMLCanvasElement>;

  private revenueChart?: Chart;
  private paymentsChart?: Chart;
  private propertiesChart?: Chart;
  private realtorsChart?: Chart;
  // Analytics state
  kpis: DashboardKpis | null = null;
  funnelLabels: string[] = [];
  funnelData: number[] = [];
  @ViewChild('funnelChart', { static: false }) funnelChartRef!: ElementRef<HTMLCanvasElement>;
  private funnelChart?: Chart;

  // Report Filters
  systemReportFilters = {
    startDate: '',
    endDate: '',
    userRole: ''
  };

  customerReportFilters = {
    startDate: '',
    endDate: '',
    activityType: ''
  };

  // Report Data
  systemActivities: any[] = [];
  customerActivities: any[] = [];
  filteredSystemActivities: any[] = [];
  filteredCustomerActivities: any[] = [];
  systemReportLoading = false;
  customerReportLoading = false;

  // System Report Columns
  systemReportColumns: TableColumn[] = [
    {
      key: 'user_name',
      title: 'User',
      sortable: true,
      type: 'text',
    },
    {
      key: 'user_role',
      title: 'Role',
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
      key: 'details',
      title: 'Details',
      sortable: false,
      type: 'text',
    },
    {
      key: 'date',
      title: 'Date & Time',
      sortable: true,
      type: 'text',
    },
  ];

  systemReportActions: TableAction[] = [
    {
      key: 'view',
      label: 'View Details',
      icon: 'eye',
      color: 'blue',
      tooltip: 'View activity details',
    },
  ];

  // Customer Report Columns
  customerReportColumns: TableColumn[] = [
    {
      key: 'customer_name',
      title: 'Customer',
      sortable: true,
      type: 'text',
    },
    {
      key: 'activity_type',
      title: 'Activity Type',
      sortable: true,
      type: 'text',
    },
    {
      key: 'description',
      title: 'Description',
      sortable: false,
      type: 'text',
    },
    {
      key: 'date',
      title: 'Date & Time',
      sortable: true,
      type: 'text',
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      type: 'status',
    },
  ];

  customerReportActions: TableAction[] = [
    {
      key: 'view',
      label: 'View Details',
      icon: 'eye',
      color: 'blue',
      tooltip: 'View customer activity details',
    },
  ];
  
  // Property analytics data
  get propertyAnalytics() {
    const availableProperties = this.metrics.find(m => m.title === 'Available Properties')?.amount as number || 72;
    const totalProperties = this.metrics.find(m => m.title === 'Total Properties')?.amount as number || 120;
    const pendingProperties = Math.floor(totalProperties * 0.23); // 23% pending
    const soldProperties = totalProperties - availableProperties - pendingProperties;
    
    return {
      available: availableProperties,
      pending: pendingProperties,
      sold: soldProperties
    };
  }
  constructor(
    private dashboardService: DashboardService,
    private themeService: ThemeService,
    private mockData: MockDataService,
    private analytics: DashboardAnalyticsService,
    private dashFilters: DashboardFiltersService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.initializeReportDates();
    this.loadSystemReport();
    this.loadCustomerReport();
    this.loadAnalytics(this.dashFilters.getSnapshot());
    this.themeService.theme$.subscribe(() => {
      this.rebuildCharts();
    });
  }

  ngAfterViewInit(): void {
    this.initAllCharts();
  }

  private initializeReportDates(): void {
    if (environment.mock) {
      // Leave empty to show all mock records by default
      this.systemReportFilters.startDate = '';
      this.systemReportFilters.endDate = '';
      this.customerReportFilters.startDate = '';
      this.customerReportFilters.endDate = '';
      return;
    }
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    this.systemReportFilters.startDate = thirtyDaysAgo.toISOString().split('T')[0];
    this.systemReportFilters.endDate = today.toISOString().split('T')[0];
    this.customerReportFilters.startDate = thirtyDaysAgo.toISOString().split('T')[0];
    this.customerReportFilters.endDate = today.toISOString().split('T')[0];
  }

  loadSystemReport(): void {
    this.systemReportLoading = true;
    if (environment.mock) {
      this.mockData.getSystemActivities().subscribe(items => {
        this.systemActivities = items;
        this.systemReportLoading = false;
        this.applySystemFilters();
      });
      return;
    }
    // TODO: real API call when available
    this.systemReportLoading = false;
    this.applySystemFilters();
  }

  loadCustomerReport(): void {
    this.customerReportLoading = true;
    
    if (environment.mock) {
      this.mockData.getCustomerActivities().subscribe(items => {
        this.customerActivities = items;
        this.customerReportLoading = false;
        this.applyCustomerFilters();
      });
      return;
    }
    // TODO: real API call when available
    this.customerReportLoading = false;
    this.applyCustomerFilters();
  }

  onSystemReportAction(event: { action: string; row: any }): void {
    console.log('System report action:', event.action, 'Row:', event.row);
    switch (event.action) {
      case 'view':
        this.viewSystemActivity(event.row);
        break;
    }
  }

  onSystemReportRowClick(row: any): void {
    console.log('System report row clicked:', row);
    this.viewSystemActivity(row);
  }

  onCustomerReportAction(event: { action: string; row: any }): void {
    console.log('Customer report action:', event.action, 'Row:', event.row);
    switch (event.action) {
      case 'view':
        this.viewCustomerActivity(event.row);
        break;
    }
  }

  onCustomerReportRowClick(row: any): void {
    console.log('Customer report row clicked:', row);
    this.viewCustomerActivity(row);
  }

  private viewSystemActivity(activity: any): void {
    // Handle viewing system activity details
    console.log('Viewing system activity:', activity);
    // You can open a modal or navigate to details page
  }

  private viewCustomerActivity(activity: any): void {
    // Handle viewing customer activity details
    console.log('Viewing customer activity:', activity);
    // You can open a modal or navigate to details page
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  loadUsers() {
    this.loading = true;
    forkJoin([
      this.dashboardService.getAdminProperties(1, 3, {}),
      this.dashboardService.getActivityLogs(1, PAGE_SIZE, {}),
    ]).subscribe({
      next: ([response1, response2]) => {
        this.properties = response1.data.slice(0, 3); // Ensure only 3 properties
        this.activities = response2.data.map((activity) => ({
          ...activity,
          full_name: activity.user.full_name,
          date: new Date(activity.createdAt).toLocaleDateString(),
          // is_active: user.is_active === true ? 'Active' : 'Inactive',
        }));
        this.loading = false;
      },
      error: (error) => {
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

  // ===== Report filtering =====
  systemSearchTerm = '';
  customerSearchTerm = '';

  onSystemSearch(term: string) {
    this.systemSearchTerm = term;
    this.applySystemFilters();
  }

  onCustomerSearch(term: string) {
    this.customerSearchTerm = term;
    this.applyCustomerFilters();
  }

  onSystemDateChange() { this.applySystemFilters(); }
  onCustomerDateChange() { this.applyCustomerFilters(); }

  private applySystemFilters(): void {
    const { startDate, endDate } = this.systemReportFilters;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const term = this.systemSearchTerm.toLowerCase();
    this.filteredSystemActivities = this.systemActivities.filter(a => {
      const dateOk = this.inRange(this.parseDate(a.date), start, end);
      const text = `${a.user_name} ${a.user_role} ${a.action} ${a.details}`.toLowerCase();
      const searchOk = !term || text.includes(term);
      return dateOk && searchOk;
    });
  }

  private applyCustomerFilters(): void {
    const { startDate, endDate } = this.customerReportFilters;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const term = this.customerSearchTerm.toLowerCase();
    this.filteredCustomerActivities = this.customerActivities.filter(a => {
      const dateOk = this.inRange(this.parseDate(a.date), start, end);
      const text = `${a.customer_name} ${a.activity_type} ${a.description} ${a.status}`.toLowerCase();
      const searchOk = !term || text.includes(term);
      return dateOk && searchOk;
    });
  }

  private parseDate(val: string): Date | null {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  private inRange(date: Date | null, start: Date | null, end: Date | null): boolean {
    if (!date) return true; // keep if missing
    if (start && date < start) return false;
    if (end) {
      // include entire end day
      const endOfDay = new Date(end);
      endOfDay.setHours(23, 59, 59, 999);
      if (date > endOfDay) return false;
    }
    return true;
  }

  // ============ Charts ============
  private cssVars() {
    const cs = getComputedStyle(document.documentElement);
    return {
      primary: cs.getPropertyValue('--primary').trim() || '#E41C24',
      text: cs.getPropertyValue('--text').trim() || '#111827',
      muted: cs.getPropertyValue('--muted').trim() || '#6b7280',
      border: cs.getPropertyValue('--border').trim() || '#e5e7eb',
      surface: cs.getPropertyValue('--surface').trim() || '#ffffff',
    };
  }

  private initAllCharts(): void {
    this.destroyCharts();
    this.initRevenueChart();
    this.initPaymentsChart();
    this.initPropertiesChart();
    this.initRealtorsChart();
    this.initFunnelChart();
  }

  private rebuildCharts(): void {
    this.initAllCharts();
  }

  private destroyCharts(): void {
    this.revenueChart?.destroy();
    this.paymentsChart?.destroy();
    this.propertiesChart?.destroy();
    this.realtorsChart?.destroy();
    this.funnelChart?.destroy();
  }

  private initRevenueChart(): void {
    const ctx = this.revenueChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    const v = this.cssVars();
    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Revenue (₦)',
          data: [],
          borderColor: v.primary,
          backgroundColor: 'rgba(228, 28, 36, 0.12)',
          pointBackgroundColor: v.primary,
          tension: 0.35,
          borderWidth: 3,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            ticks: {
              color: v.muted,
              callback: (val: any) => '₦' + (Number(val)/1_000_000).toFixed(0) + 'M'
            },
            grid: { color: v.border }
          },
          x: { ticks: { color: v.muted }, grid: { display: false } }
        },
        plugins: { legend: { labels: { color: v.text } } }
      }
    });
    this.analytics.getRevenueSeries(this.dashFilters.getSnapshot()).subscribe(s => {
      if (!this.revenueChart) return;
      this.revenueChart.data.labels = s.labels;
      (this.revenueChart.data.datasets[0].data as number[]) = s.data;
      this.revenueChart.update();
    });
  }

  private initPaymentsChart(): void {
    const ctx = this.paymentsChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    const v = this.cssVars();
    this.paymentsChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [v.primary, '#10B981', '#3B82F6', '#F59E0B'],
          borderColor: v.surface,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: v.text } }
        }
      }
    });
    this.analytics.getPaymentsByMethod(this.dashFilters.getSnapshot()).subscribe(s => {
      if (!this.paymentsChart) return;
      this.paymentsChart.data.labels = s.labels;
      (this.paymentsChart.data.datasets[0].data as number[]) = s.data;
      this.paymentsChart.update();
    });
  }

  private initPropertiesChart(): void {
    const ctx = this.propertiesChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    const v = this.cssVars();
    this.propertiesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Units',
          data: [],
          backgroundColor: [ '#10B981', '#F59E0B', v.primary ],
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: v.muted }, grid: { display: false } },
          y: { ticks: { color: v.muted }, grid: { color: v.border } }
        },
        plugins: { legend: { display: false } }
      }
    });
    this.analytics.getPropertyStatus(this.dashFilters.getSnapshot()).subscribe(s => {
      if (!this.propertiesChart) return;
      this.propertiesChart.data.labels = s.labels;
      (this.propertiesChart.data.datasets[0].data as number[]) = s.data;
      this.propertiesChart.update();
    });
  }

  private initRealtorsChart(): void {
    const ctx = this.realtorsChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    const v = this.cssVars();
    this.realtorsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Closed Deals',
          data: [],
          backgroundColor: v.primary,
          borderRadius: 6,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { ticks: { color: v.muted } },
          x: { ticks: { color: v.muted }, grid: { color: v.border } }
        },
        plugins: { legend: { display: false } }
      }
    });
    this.analytics.getTopRealtors(this.dashFilters.getSnapshot()).subscribe(s => {
      if (!this.realtorsChart) return;
      this.realtorsChart.data.labels = s.labels;
      (this.realtorsChart.data.datasets[0].data as number[]) = s.data;
      this.realtorsChart.update();
    });
  }

  private initFunnelChart(): void {
    const ctx = this.funnelChartRef?.nativeElement.getContext('2d');
    if (!ctx) return;
    const v = this.cssVars();
    this.funnelChart = new Chart(ctx, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Count', data: [], backgroundColor: v.primary, borderRadius: 6 }] },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { ticks: { color: v.muted } }, x: { ticks: { color: v.muted }, grid: { color: v.border } } },
        plugins: { legend: { display: false } }
      }
    });
    this.analytics.getFunnel(this.dashFilters.getSnapshot()).subscribe(s => {
      if (!this.funnelChart) return;
      this.funnelLabels = s.labels;
      this.funnelData = s.data;
      this.funnelChart.data.labels = s.labels;
      (this.funnelChart.data.datasets[0].data as number[]) = s.data;
      this.funnelChart.update();
    });
  }

  private loadAnalytics(filters: TimeRangeFilters): void {
    this.analytics.getOverviewKpis(filters).subscribe(k => this.kpis = k);
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
