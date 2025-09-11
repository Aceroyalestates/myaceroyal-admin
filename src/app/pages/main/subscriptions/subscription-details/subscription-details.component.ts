import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SubscriptionService } from 'src/app/core/services/subscription.service';

interface SubscriptionDetails {
  id: number;
  reference: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Incomplete';
  submissionDate: string;
  lastUpdated: string;
  
  // Personal Details
  personalDetails: {
    firstName: string;
    middleName: string;
    lastName: string;
    maidenName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    idNumber: string;
    maritalStatus: string;
    address: string;
    passportPhotoUrl?: string;
    identityUploadUrl?: string;
  };
  
  // Next of Kin Details
  nextOfKinDetails: {
    fullName: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
    occupation: string;
  };
  
  // Employment Details
  employmentDetails: {
    employmentStatus: string;
    employerName: string;
    jobTitle: string;
    workAddress: string;
    monthlyIncome: string;
    yearsOfEmployment: string;
    employerPhone: string;
  };
  
  // Payment Details
  paymentDetails: {
    propertyPurchased: string;
    totalUnits: number;
    unitPrice: string;
    totalAmount: string;
    paymentPlan: string;
    sourceOfFunds: string;
    propertyUsage: string;
    initialDeposit: string;
    paymentMethod: string;
    balanceDue: string;
    receiptUrl?: string;
    paymentDate?: string;
    purchaseStatus?: string;
  };
  
  // Realtor Details
  realtorDetails: {
    name: string;
    licenseNumber: string;
    phone: string;
    email: string;
    agency: string;
  };
  
  // Customer Details
  customerDetails: {
    preferredContactMethod: string;
    hearAboutUs: string;
    additionalRequests: string;
    investmentGoals: string;
  };

  // Purchase Details (expanded)
  purchaseDetails: {
    id: string;
    userId: string;
    unitId: number | null;
    planId: number | null;
    quantity: number | null;
    totalPrice: string;
    status: string;
    startDate: string;
    paidAt: string;
    referralCode: string;
  };

  // Form Metadata & Ownership
  metadata: {
    formStatus: string;
    acceptedTerms: boolean;
    documentationStatus: string;
    documentationSentAt: string;
    documentationNotes: string;
    submittedAt: string;
    verifiedAt: string;
    verifiedBy: string;
    rejectionReason: string;
    adminNotes: string;
    referralCode: string;
    userId: string;
    purchaseId: string;
    realtorId: string;
    realtorConsent: boolean;
    createdAt: string;
    updatedAt: string;
  };

  owner: {
    fullName: string;
    email: string;
    phone: string;
    isVerified: boolean;
    avatar?: string;
  };
}

@Component({
  selector: 'app-subscription-details',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzDescriptionsModule,
    NzSpinModule,
    NzEmptyModule
  ],
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.css']
})
export class SubscriptionDetailsComponent implements OnInit {
  subscriptionId: string = '';
  subscription: SubscriptionDetails | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.subscriptionId = this.route.snapshot.paramMap.get('id') || '';
    this.loadSubscriptionDetails();
  }

  loadSubscriptionDetails(): void {
    this.loading = true;
    
    this.subscriptionService.getFormById(this.subscriptionId).subscribe({
      next: (item: any) => {
        this.subscription = this.mapToDetails(item);
      },
      error: (err) => {
        console.error('[SubscriptionDetails] loadSubscriptionDetails -> error', err);
        this.message.error('Failed to load subscription details');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/main/subscriptions']);
  }

  viewUser(userId?: string): void {
    const id = userId || this.subscription?.metadata?.userId;
    if (!id) return;
    this.router.navigate(['/main/user-management/view', id]);
  }

  viewRealtor(realtorId?: string): void {
    const id = realtorId || this.subscription?.metadata?.realtorId;
    if (!id) return;
    this.router.navigate(['/main/realtor-management/details', id]);
  }

  getDocStatusColor(status: string | undefined): string {
    const s = (status || '').toLowerCase();
    if (!s) return 'default';
    if (s.includes('not')) return 'default';
    if (s.includes('in')) return 'processing';
    if (s.includes('sent')) return 'warning';
    if (s.includes('complete') || s.includes('done')) return 'success';
    return 'default';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'processing';
      case 'Pending':
        return 'warning';
      case 'Incomplete':
        return 'error';
      default:
        return 'default';
    }
  }

  getCompletionPercentage(): number {
    if (!this.subscription) return 0;
    
    const sections = [
      this.subscription.personalDetails,
      this.subscription.nextOfKinDetails,
      this.subscription.employmentDetails,
      this.subscription.paymentDetails,
      this.subscription.realtorDetails,
      this.subscription.customerDetails
    ];
    
    let completedSections = 0;
    sections.forEach(section => {
      const values = Object.values(section);
      const filledValues = values.filter(value => value && value.toString().trim() !== '');
      if (filledValues.length === values.length) {
        completedSections++;
      }
    });
    
    return Math.round((completedSections / sections.length) * 100);
  }

  sendReminder(): void {
    this.message.success('Reminder sent successfully to complete subscription form');
  }

  downloadForm(): void {
    this.message.info('Downloading subscription form...');
  }

  editSubscription(): void {
    this.message.info('Edit subscription functionality coming soon...');
  }

  downloadReceipt(): void {
    const url = this.subscription?.paymentDetails.receiptUrl;
    if (!url) {
      this.message.warning('No receipt available');
      return;
    }
    try {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    } catch {
      window.open(url, '_blank');
    }
  }

  viewPassport(): void {
    const url = this.subscription?.personalDetails.passportPhotoUrl;
    if (!url) { this.message.info('No passport photo available'); return; }
    window.open(url, '_blank');
  }

  viewIdentity(): void {
    const url = this.subscription?.personalDetails.identityUploadUrl;
    if (!url) { this.message.info('No identity document available'); return; }
    window.open(url, '_blank');
  }

  private mapToDetails(it: any): SubscriptionDetails {
    const fullName = it['owner']?.['full_name']
      || [it['first_name'], it['last_name']].filter(Boolean).join(' ').trim()
      || it['email']
      || '';
    const employmentStatus = it['employer_name'] ? 'Employed' : '—';
    const purchase = it['purchase'] || {};
    return {
      id: 0,
      reference: String(it['id'] || ''),
      status: this.toTitleCase(String(it['form_status'] || 'Pending')) as any,
      submissionDate: it['createdAt'] || '',
      lastUpdated: it['updatedAt'] || '',

      personalDetails: {
        firstName: it['first_name'] || '',
        middleName: it['middle_name'] || '',
        lastName: it['last_name'] || '',
        maidenName: it['maiden_name'] || '',
        email: it['email'] || '',
        phone: it['phone'] || '',
        dateOfBirth: it['date_of_birth'] || '',
        nationality: it['nationality'] || '',
        idNumber: it['means_of_identity'] || '',
        maritalStatus: it['marital_status'] || '',
        address: it['residential_address'] || '',
        passportPhotoUrl: it['passport_photo_url'] || '',
        identityUploadUrl: it['identity_upload_url'] || ''
      },

      nextOfKinDetails: {
        fullName: [it['nok_first_name'], it['nok_last_name']].filter(Boolean).join(' ').trim(),
        relationship: it['nok_relationship'] || '',
        phone: it['nok_phone'] || '',
        email: it['nok_email'] || '',
        address: it['nok_address'] || '',
        occupation: it['nok_occupation'] || ''
      },

      employmentDetails: {
        employmentStatus,
        employerName: it['employer_name'] || '',
        jobTitle: it['employer_designation'] || '',
        workAddress: it['employer_address'] || '',
        monthlyIncome: '',
        yearsOfEmployment: '',
        employerPhone: it['employer_phone'] || ''
      },

      paymentDetails: {
        propertyPurchased: this.toTitleCase(String(it['property_type'] || '')),
        totalUnits: purchase['quantity'] || 0,
        unitPrice: purchase['total_price'] ? `₦${Number(purchase['total_price']).toLocaleString()}` : '',
        totalAmount: it['amount_paid'] ? `₦${Number(it['amount_paid']).toLocaleString()}` : '',
        paymentPlan: purchase['plan_id'] ? String(purchase['plan_id']) : '',
        sourceOfFunds: it['source_of_funds'] || '',
        propertyUsage: it['property_usage'] || '',
        initialDeposit: purchase['initial_payment_due'] ? `₦${Number(purchase['initial_payment_due']).toLocaleString()}` : '',
        paymentMethod: this.toTitleCase(String(purchase['payment_method'] || '')),
        balanceDue: purchase['balance_due'] ? `₦${Number(purchase['balance_due']).toLocaleString()}` : '',
        receiptUrl: it['payment_receipt_url'] || '',
        paymentDate: it['payment_date'] || '',
        purchaseStatus: this.toTitleCase(String(purchase['status'] || '')),
      },

      realtorDetails: {
        name: it['realtor_name'] || '',
        licenseNumber: '',
        phone: it['realtor_phone'] || '',
        email: it['realtor_email'] || '',
        agency: ''
      },

      customerDetails: {
        preferredContactMethod: '',
        hearAboutUs: '',
        additionalRequests: it['admin_notes'] || '',
        investmentGoals: ''
      },

      purchaseDetails: {
        id: String(purchase['id'] || ''),
        userId: String(purchase['user_id'] || ''),
        unitId: purchase['unit_id'] ?? null,
        planId: purchase['plan_id'] ?? null,
        quantity: purchase['quantity'] ?? null,
        totalPrice: purchase['total_price'] ? `₦${Number(purchase['total_price']).toLocaleString()}` : '',
        status: this.toTitleCase(String(purchase['status'] || '')),
        startDate: purchase['start_date'] || '',
        paidAt: purchase['paid_at'] || '',
        referralCode: purchase['referral_code'] || ''
      },

      metadata: {
        formStatus: this.toTitleCase(String(it['form_status'] || '')),
        acceptedTerms: Boolean(it['accepted_terms']),
        documentationStatus: this.toTitleCase(String(it['documentation_status'] || '')),
        documentationSentAt: it['documentation_sent_at'] || '',
        documentationNotes: it['documentation_notes'] || '',
        submittedAt: it['submitted_at'] || '',
        verifiedAt: it['verified_at'] || '',
        verifiedBy: it['verified_by'] || '',
        rejectionReason: it['rejection_reason'] || '',
        adminNotes: it['admin_notes'] || '',
        referralCode: it['referral_code'] || '',
        userId: it['user_id'] || '',
        purchaseId: it['purchase_id'] || '',
        realtorId: it['realtor_id'] || '',
        realtorConsent: Boolean(it['realtor_consent']),
        createdAt: it['createdAt'] || '',
        updatedAt: it['updatedAt'] || ''
      },

      owner: {
        fullName: it['owner']?.['full_name'] || '',
        email: it['owner']?.['email'] || '',
        phone: it['owner']?.['phone_number'] || '',
        isVerified: Boolean(it['owner']?.['is_verified']),
        avatar: it['owner']?.['avatar'] || ''
      }
    };
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
