import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription as RxSubscription } from 'rxjs';
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
  id: number;
  reference: string;
  clientName: string;
  propertyName: string;
  formType: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Incomplete';
  submissionDate: string;
  lastUpdated: string;
  completionPercentage: number;
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

  constructor(private router: Router, private themeService: ThemeService) {}  // Subscription metrics data
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
  subscriptions: Subscription[] = [
    {
      id: 1,
      reference: 'SUB-000001',
      clientName: 'John Michael Doe',
      propertyName: 'Royal Gardens Estate - Block A',
      formType: 'Property Purchase Form',
      status: 'In Progress',
      submissionDate: '2024-08-15',
      lastUpdated: '2024-08-20',
      completionPercentage: 75
    },
    {
      id: 2,
      reference: 'SUB-000002',
      clientName: 'Jane Smith',
      propertyName: 'Ocean View Apartments',
      formType: 'Investment Form',
      status: 'Completed',
      submissionDate: '2024-08-10',
      lastUpdated: '2024-08-18',
      completionPercentage: 100
    },
    {
      id: 3,
      reference: 'SUB-000003',
      clientName: 'Robert Johnson',
      propertyName: 'City Center Complex',
      formType: 'Property Purchase Form',
      status: 'Incomplete',
      submissionDate: '2024-08-12',
      lastUpdated: '2024-08-12',
      completionPercentage: 35
    },
    {
      id: 4,
      reference: 'SUB-000004',
      clientName: 'Sarah Williams',
      propertyName: 'Green Valley Estate',
      formType: 'Rental Agreement Form',
      status: 'Pending',
      submissionDate: '2024-08-18',
      lastUpdated: '2024-08-19',
      completionPercentage: 60
    },
    {
      id: 5,
      reference: 'SUB-000005',
      clientName: 'Michael Brown',
      propertyName: 'Skyline Towers',
      formType: 'Investment Form',
      status: 'In Progress',
      submissionDate: '2024-08-14',
      lastUpdated: '2024-08-21',
      completionPercentage: 85
    }
  ];

  // Chart data
  chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [850, 920, 1050, 1180, 1200, 1250]
  };

  // Search and filter properties
  searchTerm: string = '';
  selectedPeriod: string = 'Last 30 Days';
  selectedPlanType: string = '';
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
        // Check for dark mode
        const isDarkMode = document.documentElement.classList.contains('dark');
        const textColor = isDarkMode ? '#d1d5db' : '#6B7280';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.chartData.labels,
            datasets: [{
              label: 'Subscriptions',
              data: this.chartData.data,
              borderColor: '#E41C24',
              backgroundColor: 'rgba(228, 28, 36, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#E41C24',
              pointBorderColor: isDarkMode ? '#1f1f23' : '#fff',
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
                backgroundColor: isDarkMode ? 'rgba(31, 31, 35, 0.95)' : 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#E41C24',
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
    console.log('Exporting subscription data...');
  }

  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    // Implement search filtering logic
  }

  onPlanTypeChange(planType: string): void {
    this.selectedPlanType = planType;
    // Implement plan type filtering logic
  }

  onDateRangeChange(): void {
    // Implement date range filtering logic
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
}
