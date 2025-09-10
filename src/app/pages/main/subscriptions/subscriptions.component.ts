import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription as RxSubscription } from 'rxjs';
import { SubscriptionService } from 'src/app/core/services/subscription.service';
import { GetFormsParams } from 'src/app/core/models/subscriptions';
import { ThemeService } from 'src/app/core/services/theme.service';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import Chart from 'chart.js/auto';

interface SubscriptionMetric {
  id: number;
  title: string;
  amount: string;
  percentage: string;
  trend: 'up' | 'down';
  color: string;
}

interface Subscription {
  id: string;
  reference: string;
  clientName: string;
  propertyName: string;
  formType: string;
  status: string;
  submissionDate: string;
  lastUpdated: string;
  completionPercentage?: number;
}

@Component({
  selector: 'app-subscriptions',
  imports: [
    CommonModule,
    SharedModule, 
    SearchBarComponent,
    NzSelectModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzInputModule,
    NzRadioModule,
    NzDatePickerModule,
    NzDividerModule,
    FormsModule
  ],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css'],
})
export class SubscriptionsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;
  private themeSubscription: RxSubscription = new RxSubscription();

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private subscriptionService: SubscriptionService
  ) {}
  subscriptionMetrics: SubscriptionMetric[] = [
    {
      id: 1,
      title: 'Total Forms Submitted',
      amount: '1,250',
      percentage: '15%',
      trend: 'up',
      color: '#10B981'
    },
    {
      id: 2,
      title: 'Completed Forms',
      amount: '956',
      percentage: '12%',
      trend: 'up',
      color: '#3B82F6'
    },
    {
      id: 3,
      title: 'In Progress',
      amount: '182',
      percentage: '8%',
      trend: 'up',
      color: '#F59E0B'
    },
    {
      id: 4,
      title: 'Incomplete Forms',
      amount: '112',
      percentage: '5%',
      trend: 'down',
      color: '#EF4444'
    }
  ];

  // Subscription form data
  subscriptions: Subscription[] = [];
  loading = false;
  // Server pagination state
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  // Chart data
  chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [850, 920, 1050, 1180, 1200, 1250]
  };

  // Search and filter properties
  searchTerm: string = '';
  selectedPeriod: string = 'Last 30 Days';
  selectedStatus: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  
  periodOptions = [
    'Last 30 Days',
    'Last 6 Months',
    'This Year'
  ];

  // Table columns configuration
  columns: TableColumn[] = [
    {
      key: 'reference',
      title: 'Reference',
      sortable: true,
      type: 'text'
    },
    {
      key: 'clientName',
      title: 'Client Name',
      sortable: true,
      type: 'text'
    },
    {
      key: 'propertyName',
      title: 'Property',
      sortable: true,
      type: 'text'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
      type: 'status',
      filterOptions: [
        { label: 'Completed', value: 'Completed' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Incomplete', value: 'Incomplete' }
      ]
    },
    {
      key: 'submissionDate',
      title: 'Submission Date',
      sortable: true,
      type: 'date'
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      sortable: true,
      type: 'date'
    }
  ];

  // Table actions configuration
  actions: TableAction[] = [
    {
      key: 'view-more',
      label: 'View More',
      color: '#E41C24',
      tooltip: 'View more subscription information'
    }
  ];

  ngOnInit(): void {
    // Component initialization
    this.fetchForms();
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(() => {
      // Reinitialize chart when theme changes
      if (this.chart && this.chartCanvas) {
        this.chart.destroy();
        this.initChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.themeSubscription.unsubscribe();
  }

  initChart(): void {
    if (this.chartCanvas) {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        const cs = getComputedStyle(document.documentElement);
        const primary = cs.getPropertyValue('--primary').trim() || '#E41C24';
        const textColor = cs.getPropertyValue('--muted').trim() || '#6B7280';
        const gridColor = cs.getPropertyValue('--border').trim() || 'rgba(0, 0, 0, 0.1)';
        const isDark = document.documentElement.classList.contains('dark');
        
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.chartData.labels,
            datasets: [{
              label: 'Subscriptions',
              data: this.chartData.data,
              borderColor: primary,
              backgroundColor: 'rgba(228, 28, 36, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: primary,
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: isDark ? 'rgba(31, 31, 35, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: primary,
                borderWidth: 1
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: textColor
                }
              },
              y: {
                grid: {
                  color: gridColor
                },
                ticks: {
                  color: textColor,
                  callback: function(value) {
                    return value + '';
                  }
                }
              }
            }
          }
        });
      }
    }
  }

  onExport(): void {
    const params = this.currentFilters();
    this.subscriptionService.exportForms({ ...params, format: 'csv' }).subscribe({
      next: (blob) => {
        if (blob instanceof Blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'property-forms.csv';
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          console.log('Export JSON:', blob);
        }
      }
    });
  }

  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.pageIndex = 1;
    this.fetchForms();
  }

  onDateRangeChange(): void {
    this.pageIndex = 1;
    this.fetchForms();
  }

  onTableAction(event: { action: string; row: any }): void {
    const subscription = event.row as Subscription;
    switch (event.action) {
      case 'view-more':
        this.router.navigate(['/main/subscriptions/details', subscription.id]);
        break;
    }
  }

  onSelectionChange(selectedItems: Subscription[]): void {
    console.log('Selected subscriptions:', selectedItems);
  }

  onPageChange(event: { page: number; size: number }): void {
    this.pageIndex = event.page;
    this.pageSize = event.size;
    this.fetchForms();
  }

  private fetchForms(): void {
    this.loading = true;
    const params = this.currentFilters();
    console.log('[SubscriptionsComponent] fetchForms -> params', params);
    this.subscriptionService.getForms(params).subscribe({
      next: (res) => {
        console.log('[SubscriptionsComponent] fetchForms -> response', res);
        const items = (res.data || []) as any[];
        this.subscriptions = items.map((it) => {
          const fullName = it['owner']?.['full_name']
            || [it['first_name'], it['last_name']].filter(Boolean).join(' ').trim()
            || it['email']
            || '—';
          const property = it['purchase']?.['unit']?.['id']
            ? `Unit #${it['purchase']['unit']['id']}`
            : (it['property_type'] ? this.toTitleCase(String(it['property_type'])) : '—');
          return {
            id: String(it['id'] ?? ''),
            reference: String(it['id'] ?? ''),
            clientName: fullName,
            propertyName: property,
            formType: 'Property Purchase Form',
            status: this.toTitleCase(String(it['form_status'] || '—')),
            submissionDate: it['createdAt'] || it['created_at'] || '',
            lastUpdated: it['updatedAt'] || it['updated_at'] || '',
          } as Subscription;
        });
        // Update server pagination from response if present
        this.total = (res as any)?.pagination?.total ?? this.subscriptions.length;
        this.pageIndex = (res as any)?.pagination?.page ?? this.pageIndex;
        this.pageSize = (res as any)?.pagination?.limit ?? this.pageSize;
      },
      error: (err) => {
        console.error('[SubscriptionsComponent] fetchForms -> error', err);
        this.subscriptions = [];
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private currentFilters(): GetFormsParams {
    const params: GetFormsParams = {
      page: this.pageIndex,
      limit: this.pageSize,
      search: this.searchTerm || undefined,
      sortBy: 'created_at',
      sortOrder: 'DESC',
    };
    if (this.selectedStatus) {
      params.status = this.selectedStatus.toLowerCase().replace(/\s+/g, '_');
    }
    if (this.startDate) {
      params.fromDate = this.formatDate(this.startDate);
    }
    if (this.endDate) {
      params.toDate = this.formatDate(this.endDate);
    }
    return params;
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private toTitleCase(value: string): string {
    if (!value) return value;
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
