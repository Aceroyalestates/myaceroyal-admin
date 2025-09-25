import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnDef } from '@tanstack/table-core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentSchedules } from '../../../../core/constants/index';
import { CustomerService } from 'src/app/core/services/user.service';
import { AdminService, SendReminderRequest } from 'src/app/core/services/admin.service';
import { UserPurchaseDetailsResponse, UserPurchasePaymentSchedulesResponse, PaymentSchedule } from 'src/app/core/models/users';
import { MoneyFormatPipe } from 'src/app/core/pipes/money-format.pipe';
import { FormatWordPipe } from 'src/app/core/pipes/format-word.pipe';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-view-user-property',
  imports: [CommonModule, SharedModule, NzSelectModule, NzSpinModule, NzAlertModule, NzNotificationModule, MoneyFormatPipe],
  templateUrl: './view-user-property.component.html',
  styleUrls: ['./view-user-property.component.css'],
})
export class ViewUserPropertyComponent implements OnInit {
  userMetrics = Metrics;
  lucy!: string;
  people: Person[] = People;
  paymentSchedules = PaymentSchedules;
  
  // Data properties
  purchaseId: string = '';
  userId: string = '';
  userName: string = '';
  propertyName: string = '';
  loading = false;
  error: string | null = null;
  
  // Purchase details
  purchaseDetails: UserPurchaseDetailsResponse | null = null;
  paymentSchedulesData!: PaymentSchedule[];
  paymentSchedulesResponse!: UserPurchasePaymentSchedulesResponse;
  
  // Send reminder loading states
  sendingReminders = new Set<string>();
  
  private formatWordPipe = new FormatWordPipe();

  formatStatus(status: string): string {
    return this.formatWordPipe.transform(status) || status;
  }
  
  getRowLink = (row: Person) =>
    `/main/user-management/view/${row.id}/${row.name}`;
  columns: ColumnDef<Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'age', header: 'Age' },
  ];

  selectedPeople = signal<Person[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private adminService: AdminService,
    private notification: NzNotificationService
  ) {
    console.log('ViewUserPropertyComponent constructor called');
    // Optional effect to react to selected people changes
    effect(() => {
      console.log('Selected people from table:', this.selectedPeople());
    });
  }

  ngOnInit(): void {
    console.log('ViewUserPropertyComponent ngOnInit called');
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      this.purchaseId = params['purchaseId'];
      this.userId = params['userId'];
      this.userName = params['userName'];
      this.propertyName = params['propertyName'];
      console.log('Extracted purchaseId:', this.purchaseId);
      this.loadPurchaseData();
    });
  }

  loadPurchaseData(): void {
    console.log('loadPurchaseData called with purchaseId:', this.purchaseId);
    if (!this.purchaseId) {
      console.log('No purchaseId, returning early');
      return;
    }
    
    this.loading = true;
    this.error = null;
    
    console.log('Making API calls for purchaseId:', this.purchaseId);
    
    // Load purchase details first
    this.customerService.getUserPuchaseDetailsById(this.purchaseId).subscribe({
      next: (purchaseDetails) => {
        this.purchaseDetails = purchaseDetails;
        console.log('Purchase details loaded successfully:', purchaseDetails);
        
        // Load payment schedules separately
        this.loadPaymentSchedules();
      },
      error: (error) => {
        console.error('Error loading purchase details:', error);
        this.error = 'Failed to load purchase details';
        this.loading = false;
      }
    });
  }

  loadPaymentSchedules(): void {
    console.log('Loading payment schedules for purchaseId:', this.purchaseId);
    
    this.customerService.getUserPuchasePaymentSchedulesById(this.purchaseId).subscribe({
      next: (paymentSchedules) => {
        this.paymentSchedulesData = paymentSchedules.data || [];
        this.paymentSchedulesResponse = paymentSchedules;
        this.loading = false;
        console.log('Payment schedules loaded successfully:', paymentSchedules);
      },
      error: (error) => {
        console.error('Error loading payment schedules:', error);
        // Don't treat this as a critical error - just set empty data
        this.paymentSchedulesData = [];
        this.paymentSchedulesResponse = {
          message: 'No payment schedules found',
          success: true,
          data: [],
          summary: {
            totalSchedules: 0,
            totalAmountDue: 0,
            totalAmountPaid: 0,
            remainingBalance: 0,
            overdueCount: 0,
            overdueAmount: 0,
            statusBreakdown: {
              pending: 0,
              paid: 0,
              overdue: 0
            },
            nextDueSchedule: null as any
          }
        };
        this.loading = false;
        console.log('No payment schedules found for this purchase');
      }
    });
  }

  handleSelectedData(selected: Person[]) {
    this.selectedPeople.set(selected);
    console.log(this.selectedPeople);
  }

  // Helper methods for template
  formatCurrency(amount: string | number): string {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-GB');
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
        return '!text-[#1FAF38] border border-[#34A85333] bg-[#34A8531F]';
      case 'pending':
        return '!text-[#FBBC05] border border-[#FBBC0533] bg-[#FBBC051F]';
      case 'overdue':
        return '!text-[#E41C24] border border-[#E41C2433] bg-[#E41C241F]';
      default:
        return '!text-[#7A7A7A] border border-[#7A7A7A33] bg-[#7A7A7A1F]';
    }
  }

  /**
   * Send reminder for a payment schedule
   * @param schedule Payment schedule to send reminder for
   */
  sendReminder(schedule: PaymentSchedule): void {
    if (this.sendingReminders.has(schedule.id)) {
      return; // Already sending reminder for this schedule
    }

    this.sendingReminders.add(schedule.id);

    // Determine reminder type based on schedule status and due date
    const reminderType = this.getReminderType(schedule);
    const reminderMessage = this.getReminderMessage(reminderType);

    const request: SendReminderRequest = {
      type: reminderType,
      message: reminderMessage
    };

    console.log('Sending reminder for schedule:', schedule.id, request);

    this.adminService.sendReminder(schedule.id, request).subscribe({
      next: (response) => {
        console.log('Reminder sent successfully:', response);
        this.sendingReminders.delete(schedule.id);
        this.showSuccessNotification('Reminder Sent', 'Payment reminder has been sent successfully.');
      },
      error: (error) => {
        console.error('Error sending reminder:', error);
        this.sendingReminders.delete(schedule.id);
        this.showErrorNotification('Send Failed', 'Failed to send payment reminder. Please try again.');
      }
    });
  }

  /**
   * Determine the appropriate reminder type based on schedule status
   */
  private getReminderType(schedule: PaymentSchedule): 'upcoming' | 'overdue' | 'general' {
    const now = new Date();
    const dueDate = new Date(schedule.due_date);
    const status = schedule.status.toLowerCase();

    if (status === 'overdue' || (dueDate < now && status !== 'paid')) {
      return 'overdue';
    } else if (status === 'pending' && dueDate > now) {
      return 'upcoming';
    } else {
      return 'general';
    }
  }

  /**
   * Get appropriate reminder message based on type
   */
  private getReminderMessage(type: 'upcoming' | 'overdue' | 'general'): string {
    switch (type) {
      case 'upcoming':
        return 'Friendly reminder to make your upcoming installment payment.';
      case 'overdue':
        return 'Your payment is overdue. Please make your installment payment as soon as possible.';
      case 'general':
        return 'Reminder to make your installment payment.';
      default:
        return 'Friendly reminder to make your installment payment.';
    }
  }

  /**
   * Check if reminder is being sent for a specific schedule
   */
  isSendingReminder(scheduleId: string): boolean {
    return this.sendingReminders.has(scheduleId);
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
