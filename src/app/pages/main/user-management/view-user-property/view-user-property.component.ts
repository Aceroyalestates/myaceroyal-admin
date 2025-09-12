import { CommonModule } from '@angular/common';
import { Component, effect, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnDef } from '@tanstack/table-core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { Metrics, People } from 'src/app/core/constants';
import { Person } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentSchedules } from '../../../../core/constants/index';
import { CustomerService } from 'src/app/core/services/user.service';
import { UserPurchaseDetailsResponse, UserPurchasePaymentSchedulesResponse } from 'src/app/core/models/users';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-view-user-property',
  imports: [CommonModule, SharedModule, NzSelectModule, NzSpinModule, NzAlertModule],
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
  paymentSchedulesData: UserPurchasePaymentSchedulesResponse | null = null;
  
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
    private customerService: CustomerService
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
    
    forkJoin({
      purchaseDetails: this.customerService.getUserPuchaseDetailsById(this.purchaseId),
      paymentSchedules: this.customerService.getUserPuchasePaymentSchedulesById(this.purchaseId)
    }).subscribe({
      next: ({ purchaseDetails, paymentSchedules }) => {
        this.purchaseDetails = purchaseDetails;
        this.paymentSchedulesData = paymentSchedules;
        this.loading = false;
        console.log('Purchase data loaded successfully:', { purchaseDetails, paymentSchedules });
      },
      error: (error) => {
        console.error('Error loading purchase data:', error);
        this.error = 'Failed to load purchase data';
        this.loading = false;
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
}
