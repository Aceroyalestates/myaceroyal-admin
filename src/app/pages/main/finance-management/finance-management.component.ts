import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { SearchBarComponent } from 'src/app/shared/components/search-bar/search-bar.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import Chart from 'chart.js/auto';
import { ThemeService } from 'src/app/core/services/theme.service';
import { CustomerService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/users';
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
    NzTabsModule,
    NzTagModule,
    NzInputModule,
    NzRadioModule,
    NzDatePickerModule,
    NzDividerModule,
    NzEmptyModule,
    FormsModule
  ],
  templateUrl: './finance-management.component.html',
  styleUrls: ['./finance-management.component.css'],
})
export class FinanceManagementComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('paymentsMethodChart', { static: false }) paymentsMethodChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topClientsChart', { static: false }) topClientsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('topRealtorsChart', { static: false }) topRealtorsChartRef!: ElementRef<HTMLCanvasElement>;
  
  chart: Chart | null = null;
  paymentsMethodChart: Chart | null = null;
  topClientsChart: Chart | null = null;
  topRealtorsChart: Chart | null = null;

  constructor(
    private router: Router,
    private financeService: FinanceService,
    private themeService: ThemeService,
    private customerService: CustomerService
  ) {}
  
  // Active tab (below charts)
  activeTab: 'transactions' | 'upcoming' | 'aging' | 'overdue' | 'users' = 'transactions';

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

  paymentsByMethodData = {
    labels: ['Bank Transfer', 'Paystack', 'Cheque', 'Cash'],
    data: [55, 30, 10, 5]
  };

  topClientsData = {
    labels: ['Client A', 'Client B', 'Client C', 'Client D', 'Client E'],
    data: [120_000_000, 95_000_000, 80_000_000, 60_000_000, 45_000_000]
  };

  topRealtorsData = {
    labels: ['Realtor X', 'Realtor Y', 'Realtor Z', 'Realtor W', 'Realtor V'],
    data: [220_000_000, 180_000_000, 160_000_000, 120_000_000, 95_000_000]
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

  // no nested report tabs anymore

  // Upcoming payments (stubbed for now; replace with API)
  upcomingPayments: Array<{
    id: string;
    client: string;
    property: string;
    installment: string;
    dueDate: string;
    amount: string;
    status: 'Due Soon' | 'Overdue' | 'Scheduled';
    lastReminded?: string;
  }> = [
    { id: 'UP-1001', client: 'John Doe', property: 'Luxury Apartment A1', installment: '3/12', dueDate: '2025-09-20', amount: '₦ 2,500,000', status: 'Due Soon' },
    { id: 'UP-1002', client: 'Mary Jane', property: 'Office Complex B4', installment: '6/24', dueDate: '2025-09-18', amount: '₦ 1,750,000', status: 'Overdue' },
    { id: 'UP-1003', client: 'Acme Ltd.', property: 'Retail Space C2', installment: '1/6', dueDate: '2025-09-28', amount: '₦ 5,200,000', status: 'Scheduled' },
  ];

  // Overdue payments (late installments)
  overduePayments: Array<{
    id: string;
    client: string;
    property: string;
    installment: string;
    dueDate: string;
    amount: string;
    lastReminded?: string;
  }> = [
    { id: 'OD-2001', client: 'Mary Jane', property: 'Office Complex B4', installment: '6/24', dueDate: '2025-09-05', amount: '₦ 1,750,000' },
    { id: 'OD-2002', client: 'Acme Ltd.', property: 'Retail Space C2', installment: '2/6', dueDate: '2025-08-29', amount: '₦ 5,200,000' },
  ];

  // Users tab data (summary list; replace with API). Use existing user-management route to drill in.
  userSummaries: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    completedPayments: number;
    pendingPayments: number;
    nextDueDate?: string;
  }> = [];

  private allUserSummaries: Array<{
    id: string; name: string; email: string; phone: string; completedPayments: number; pendingPayments: number; nextDueDate?: string;
  }> = [];

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
      key: 'property',
      title: 'Property',
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
    this.loadUsers();
    // Rebuild chart on theme changes for consistent colors
    this.themeService.theme$.subscribe(() => {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      if (this.paymentsMethodChart) {
        this.paymentsMethodChart.destroy();
        this.paymentsMethodChart = null;
      }
      if (this.topClientsChart) {
        this.topClientsChart.destroy();
        this.topClientsChart = null;
      }
      if (this.topRealtorsChart) {
        this.topRealtorsChart.destroy();
        this.topRealtorsChart = null;
      }
      this.initChart();
      this.initPaymentsMethodChart();
      this.initTopClientsChart();
      this.initTopRealtorsChart();
    });
  }

  ngAfterViewInit(): void {
    this.initChart();
    this.initPaymentsMethodChart();
    this.initTopClientsChart();
    this.initTopRealtorsChart();
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

  private initPaymentsMethodChart(): void {
    if (!this.paymentsMethodChartRef) return;
    const ctx = this.paymentsMethodChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    const cs = getComputedStyle(document.documentElement);
    const text = cs.getPropertyValue('--text').trim() || '#6B7280';
    const palette = ['#E41C24', '#10B981', '#3B82F6', '#F59E0B'];
    this.paymentsMethodChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.paymentsByMethodData.labels,
        datasets: [{
          data: this.paymentsByMethodData.data,
          backgroundColor: palette,
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: text }
          }
        }
      }
    });
  }

  private initTopClientsChart(): void {
    if (!this.topClientsChartRef) return;
    const ctx = this.topClientsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    const cs = getComputedStyle(document.documentElement);
    const text = cs.getPropertyValue('--text').trim() || '#6B7280';
    const primary = cs.getPropertyValue('--primary').trim() || '#E41C24';
    this.topClientsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.topClientsData.labels,
        datasets: [{
          label: 'Amount Paid',
          data: this.topClientsData.data,
          backgroundColor: primary + 'AA',
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { color: text } },
          y: { ticks: { color: text, callback: (v) => '₦' + Number(v).toLocaleString() } }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  private initTopRealtorsChart(): void {
    if (!this.topRealtorsChartRef) return;
    const ctx = this.topRealtorsChartRef.nativeElement.getContext('2d');
    if (!ctx) return;
    const cs = getComputedStyle(document.documentElement);
    const text = cs.getPropertyValue('--text').trim() || '#6B7280';
    const secondary = '#6366F1';
    this.topRealtorsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.topRealtorsData.labels,
        datasets: [{
          label: 'Total Revenue',
          data: this.topRealtorsData.data,
          backgroundColor: secondary + 'AA',
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { ticks: { color: text } },
          y: { ticks: { color: text, callback: (v) => '₦' + Number(v).toLocaleString() } }
        },
        plugins: { legend: { display: false } }
      }
    });
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

  viewUser(id: string): void {
    this.router.navigate(['/main/user-management/view', id]);
  }

  onUserSearch(term: string): void {
    const q = (term || '').toLowerCase().trim();
    if (!q) {
      this.userSummaries = [...this.allUserSummaries];
      return;
    }
    this.userSummaries = this.allUserSummaries.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q)
    );
  }

  // Utility for Overdue tab
  getDaysOverdue(dueDateStr: string): number {
    const today = new Date();
    const due = new Date(dueDateStr);
    // Normalize to remove time part
    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = Math.floor((today.setHours(0,0,0,0) as unknown as number) - (due.setHours(0,0,0,0) as unknown as number));
    const days = Math.max(0, Math.floor(diff / msPerDay));
    return days;
  }

  private loadUsers(): void {
    this.customerService.getCustomerUsers(1, 20, {}).subscribe({
      next: (res) => {
        const list = (res.data || []).map((u: User) => ({
          id: String(u.id),
          name: u.full_name,
          email: u.email,
          phone: u.phone_number,
          completedPayments: Number(u.financial_transactions?.completed_payments ?? 0),
          pendingPayments: Number(u.financial_transactions?.pending_payments ?? 0),
          nextDueDate: u.financial_transactions?.next_payment_due_date || undefined,
        }));
        this.allUserSummaries = list;
        this.userSummaries = list;
      },
      error: (err) => {
        console.error('[FinanceManagementComponent] loadUsers -> error', err);
        this.allUserSummaries = [];
        this.userSummaries = [];
      },
    });
  }

  // ===== Tab badges (counts + totals) =====
  private parseCurrencyToNumber(val: string | number): number {
    if (typeof val === 'number') return val;
    const n = Number(String(val).replace(/[^\d.-]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  private sumCurrency(list: Array<{ amount: string | number }>): number {
    return list.reduce((sum, item) => sum + this.parseCurrencyToNumber(item.amount), 0);
  }

  getUpcomingTotal(): number {
    return this.sumCurrency(this.upcomingPayments);
  }

  getOverdueTotal(): number {
    return this.sumCurrency(this.overduePayments);
  }

  // ===== Aging (summary buckets) =====
  get agingBuckets() {
    const buckets = [
      { name: '0–30 days', min: 0, max: 30 },
      { name: '31–60 days', min: 31, max: 60 },
      { name: '61–90 days', min: 61, max: 90 },
      { name: '90+ days', min: 91, max: Infinity },
    ];
    const rows = buckets.map(b => ({ name: b.name, count: 0, total: 0 }));
    this.overduePayments.forEach(item => {
      const days = this.getDaysOverdue(item.dueDate);
      const amt = this.parseCurrencyToNumber(item.amount);
      const idx = days <= 30 ? 0 : days <= 60 ? 1 : days <= 90 ? 2 : 3;
      rows[idx].count += 1;
      rows[idx].total += amt;
    });
    return rows;
  }

  get agingCount(): number {
    return this.agingBuckets.reduce((sum: number, b: { count: number }) => sum + (b.count || 0), 0);
  }

  get agingTotal(): number {
    return this.agingBuckets.reduce((sum: number, b: { total: number }) => sum + (b.total || 0), 0);
  }

  // Drill-down from Aging -> Overdue
  overdueBucketFilter: string | null = null;

  private rangeForBucket(name: string): { min: number; max: number } | null {
    switch (name) {
      case '0–30 days': return { min: 0, max: 30 };
      case '31–60 days': return { min: 31, max: 60 };
      case '61–90 days': return { min: 61, max: 90 };
      case '90+ days': return { min: 91, max: Number.POSITIVE_INFINITY };
      default: return null;
    }
  }

  get filteredOverduePayments() {
    if (!this.overdueBucketFilter) return this.overduePayments;
    const range = this.rangeForBucket(this.overdueBucketFilter);
    if (!range) return this.overduePayments;
    return this.overduePayments.filter(item => {
      const d = this.getDaysOverdue(item.dueDate);
      return d >= range.min && d <= range.max;
    });
  }

  onAgingRowClick(row: { name: string }): void {
    this.overdueBucketFilter = row?.name || null;
    this.activeTab = 'overdue';
  }

  clearOverdueBucketFilter(): void {
    this.overdueBucketFilter = null;
  }

  sendReminder(item: { id: string; client: string; lastReminded?: string }): void {
    item.lastReminded = new Date().toISOString();
    console.log('Reminder sent for', item.id, 'to', item.client);
    // Hook up to notification service when available
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
    if (this.paymentsMethodChart) {
      this.paymentsMethodChart.destroy();
    }
    if (this.topClientsChart) {
      this.topClientsChart.destroy();
    }
    if (this.topRealtorsChart) {
      this.topRealtorsChart.destroy();
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
        const mapped = (res.data || []).map((t: FinanceTransaction): Transaction => {
          const clientName = (t as any)?.payer?.full_name
            || (t as any)?.purchase?.buyer?.full_name
            || (t as any)?.user?.full_name
            || (t as any)?.customer_name
            || (t as any)?.client
            || (t.user_id ? String(t.user_id) : '—');
          const propertyName = (t as any)?.purchase?.unit?.property?.name
            || (t as any)?.property?.name
            || (t as any)?.purchase?.unit?.property_name
            || (t as any)?.purchase?.unit?.property_id
            || '—';
          return {
            id: String(t.id ?? ''),
            paymentType: 'Purchase Payment',
            client: clientName,
            property: propertyName,
            modeOfPayment: t.method || '—',
            amount: this.formatCurrency(t.amount),
            status: this.mapStatus(t.status),
            action: 'View Details',
          } as Transaction;
        });
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

  // Match dashboard metric card background style
  getTransparentColor(hex: string): string {
    if (!hex || !hex.startsWith('#')) return hex || 'transparent';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }

  // Shorten large currency to millions/billions for compact cards
  formatShortAmount(amount: string | number): string {
    const raw = typeof amount === 'number' ? amount : Number(String(amount).replace(/[^\d.-]/g, ''));
    if (isNaN(raw)) return String(amount ?? '₦0');
    if (Math.abs(raw) >= 1_000_000_000) {
      const b = Math.round((raw / 1_000_000_000) * 10) / 10; // 1 decimal
      return `₦${b}B`;
    }
    const m = Math.round((raw / 1_000_000) * 10) / 10; // 1 decimal
    return `₦${m}M`;
  }
}
