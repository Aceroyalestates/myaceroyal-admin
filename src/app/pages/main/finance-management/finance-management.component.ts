import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
import { ThemeService } from 'src/app/core/services/theme.service';
import { FinanceService } from 'src/app/core/services/finance.service';
import { FinanceTransaction, TransactionListParams, FinanceMetric, Transaction } from 'src/app/core/models/finance';

@Component({
  selector: 'app-finance-management',
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
  templateUrl: './finance-management.component.html',
  styleUrls: ['./finance-management.component.css'],
})
export class FinanceManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  chart: Chart | null = null;

  constructor(private router: Router, private financeService: FinanceService, private themeService: ThemeService) {}
  
  // Finance metrics data - can be replaced with API data
  financeMetrics: FinanceMetric[] = [
    {
      id: 1,
      title: 'Total Balance',
      amount: '₦300,000,000',
      percentage: '20.%',
      trend: 'up',
      color: '#FFB800'
    },
    {
      id: 2,
      title: 'Total Income',
      amount: '₦123,000,000',
      percentage: '20.%',
      trend: 'up',
      color: '#10B981'
    }
  ];

  // Transactions fetched from API
  transactions: Transaction[] = [];
  loading = false;

  // Chart data - can be replaced with API data
  chartData = {
    labels: ['Aug 01', 'Aug 10', 'Aug 15', 'Aug 25', 'Aug 30', 'Sept 01'],
    data: [80000000, 85000000, 82000000, 95000000, 135000000, 130000000]
  };

  // Search and filter properties
  searchTerm: string = '';
  selectedPeriod: string = 'Last 30 Days';
  selectedPropertyName: string = '';
  selectedModeOfPayment: string = '';
  selectedPaymentStatus: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  dateRange: [Date, Date] | null = null;
  
  periodOptions = [
    'Last 7 Days',
    'Last 30 Days',
    'Last 90 Days',
    'This Year'
  ];

  // Table columns configuration for the reusable table component
  columns: TableColumn[] = [
    {
      key: 'paymentType',
      title: 'Payment Type',
      sortable: true,
      type: 'text'
    },
    {
      key: 'client',
      title: 'Client',
      sortable: true,
      type: 'text'
    },
    {
      key: 'modeOfPayment',
      title: 'Mode of Payment',
      sortable: true,
      filterable: true,
      type: 'text',
      filterOptions: [
        { label: 'Bank Transfer', value: 'Bank Transfer' },
        { label: 'Paystack', value: 'Paystack' },
        { label: 'Bank Cheque', value: 'Bank Cheque' },
        { label: 'Cash', value: 'Cash' }
      ]
    },
    {
      key: 'amount',
      title: 'Amount',
      sortable: true,
      type: 'text',
      align: 'right'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      filterable: true,
      type: 'status',
      filterOptions: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
        { label: 'Under Review', value: 'Under Review' },
        { label: 'Failed', value: 'Failed' }
      ]
    }
  ];

  // Table actions configuration
  actions: TableAction[] = [
    {
      key: 'view-details',
      label: 'View Details',
      color: '#E41C24',
      tooltip: 'View transaction details'
    }
  ];

  ngOnInit(): void {
    // Load initial data
    console.log('[FinanceManagementComponent] ngOnInit');
    this.fetchTransactions();
    // Rebuild chart on theme changes for consistent colors
    this.themeService.theme$.subscribe(() => {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      this.initChart();
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
  }

  initChart(): void {
    if (this.chartCanvas) {
      const ctx = this.chartCanvas.nativeElement.getContext('2d');
      if (ctx) {
        const cs = getComputedStyle(document.documentElement);
        const primary = cs.getPropertyValue('--primary').trim() || '#E41C24';
        const text = cs.getPropertyValue('--text').trim() || '#6B7280';
        const grid = cs.getPropertyValue('--border').trim() || '#F3F4F6';
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.chartData.labels,
            datasets: [{
              label: 'Transaction Balance',
              data: this.chartData.data,
              borderColor: primary,
              backgroundColor: 'rgba(228, 28, 36, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: primary,
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                min: 40000000,
                max: 140000000,
                ticks: {
                  callback: function(value) {
                    return '₦' + (Number(value) / 1000000).toFixed(0) + 'M';
                  },
                  color: text,
                  font: {
                    size: 12
                  }
                },
                grid: {
                  color: grid
                }
              },
              x: {
                ticks: {
                  color: text,
                  font: {
                    size: 12
                  }
                },
                grid: {
                  display: false
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                backgroundColor: '#1F2937',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: primary,
                borderWidth: 1,
                callbacks: {
                  label: function(context) {
                    return '₦' + context.parsed.y.toLocaleString();
                  }
                }
              }
            },
            elements: {
              point: {
                hoverBackgroundColor: primary
              }
            }
          }
        });
      }
    }
  }

  onSearch(): void {
    // Trigger API fetch with search term (client-side term for now)
    console.log('[FinanceManagementComponent] onSearch', { term: this.searchTerm });
    this.fetchTransactions();
  }

  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    // Implement debounced search or immediate filtering
    if (searchTerm.length >= 3 || searchTerm.length === 0) {
      // Trigger search
      this.performSearch();
    }
  }

  onSearchTermChange(searchTerm: string): void {
    this.onSearchChange(searchTerm);
  }

  onPropertyNameChange(propertyName: string): void {
    this.selectedPropertyName = propertyName;
    console.log('Property name filter changed:', propertyName);
    // Not mapped to API currently
  }

  onModeOfPaymentChange(modeOfPayment: string): void {
    this.selectedModeOfPayment = modeOfPayment;
    console.log('Mode of payment filter changed:', modeOfPayment);
    console.log('[FinanceManagementComponent] onModeOfPaymentChange', { modeOfPayment });
    this.fetchTransactions();
  }

  onPaymentStatusChange(paymentStatus: string): void {
    this.selectedPaymentStatus = paymentStatus;
    console.log('Payment status filter changed:', paymentStatus);
    console.log('[FinanceManagementComponent] onPaymentStatusChange', { paymentStatus });
    this.fetchTransactions();
  }

  performSearch(): void {
    // Trigger API fetch with current filters
    this.fetchTransactions();
  }

  onExport(): void {
    // Implement export functionality
    console.log('Exporting financial data...');
  }

  onDateRangeChange(dateRange?: [Date, Date] | null): void {
    if (dateRange) {
      this.dateRange = dateRange;
    }
    console.log('Date range changed:', this.startDate, this.endDate);
    // Fetch with date filters
    this.performSearch();
  }

  handleSelectedData(data: any): void {
    console.log('Selected data:', data);
  }

  onTableAction(event: { action: string; row: any }): void {
    console.log('Table action:', event.action, 'Row:', event.row);
    switch (event.action) {
      case 'view-details':
        this.viewTransactionDetails(event.row);
        break;
    }
  }

  onSelectionChange(selectedRows: any[]): void {
    console.log('Selected rows:', selectedRows);
  }

  viewTransactionDetails(transaction: Transaction): void {
    console.log('Viewing transaction details:', transaction);
    // Navigate to transaction details page
    this.router.navigate(['/main/finance-management/transaction', transaction.id]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm';
      case 'Pending':
        return 'text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm';
      case 'Under Review':
        return 'text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm';
      case 'Failed':
        return 'text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm';
      default:
        return 'text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm';
    }
  }

  // Method to update chart data when API data is available
  updateChartData(newData: { labels: string[], data: number[] }): void {
    if (this.chart) {
      this.chart.data.labels = newData.labels;
      this.chart.data.datasets[0].data = newData.data;
      this.chart.update();
    }
  }

  // Method to update metrics when API data is available
  updateMetrics(newMetrics: FinanceMetric[]): void {
    this.financeMetrics = newMetrics;
  }

  // Method to update transactions when API data is available
  updateTransactions(newTransactions: Transaction[]): void {
    this.transactions = newTransactions;
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private fetchTransactions(): void {
    this.loading = true;
    const params: TransactionListParams = {
      page: 1,
      limit: 10,
      sort_by: 'createdAt',
      sort_order: 'DESC',
    };

    if (this.selectedModeOfPayment) {
      params.method = this.selectedModeOfPayment;
    }
    if (this.selectedPaymentStatus) {
      params.status = this.selectedPaymentStatus;
    }
    if (this.startDate) {
      params.from_date = this.formatDate(this.startDate);
    }
    if (this.endDate) {
      params.to_date = this.formatDate(this.endDate);
    }

    console.log('[FinanceManagementComponent] fetchTransactions -> params', params);
    this.financeService.getTransactions(params).subscribe({
      next: (res) => {
        console.log('[FinanceManagementComponent] fetchTransactions -> response', res);
        const mapped = (res.data || []).map((t: FinanceTransaction): Transaction => ({
          id: String(t.id ?? ''),
          paymentType: 'Purchase Payment',
          client: t.user_id ? String(t.user_id) : '—',
          modeOfPayment: t.method || '—',
          amount: this.formatCurrency(t.amount),
          status: this.mapStatus(t.status),
          action: 'View Details',
        }));
        this.transactions = mapped;
      },
      error: () => {
        console.error('[FinanceManagementComponent] fetchTransactions -> error');
        this.transactions = [];
      },
      complete: () => {
        console.log('[FinanceManagementComponent] fetchTransactions -> complete');
        this.loading = false;
      }
    });
  }

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private formatCurrency(value: any): string {
    const num = Number(value);
    if (isNaN(num)) return String(value ?? '₦0');
    return '₦ ' + num.toLocaleString();
  }

  private mapStatus(status: any): string {
    const s = String(status || '').toLowerCase();
    switch (s) {
      case 'approved':
      case 'success':
      case 'successful':
        return 'Approved';
      case 'pending':
      case 'processing':
      case 'in_review':
        return 'Pending';
      case 'under review':
      case 'review':
        return 'Under Review';
      case 'failed':
      case 'rejected':
        return 'Failed';
      default:
        return status ? String(status) : 'Pending';
    }
  }
}
