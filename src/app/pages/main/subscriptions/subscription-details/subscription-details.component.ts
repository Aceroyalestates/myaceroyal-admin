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
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    idNumber: string;
    maritalStatus: string;
    address: string;
  };
  
  // Next of Kin Details
  nextOfKinDetails: {
    fullName: string;
    relationship: string;
    phone: string;
    email: string;
    address: string;
  };
  
  // Employment Details
  employmentDetails: {
    employmentStatus: string;
    employerName: string;
    jobTitle: string;
    workAddress: string;
    monthlyIncome: string;
    yearsOfEmployment: string;
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
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.subscriptionId = this.route.snapshot.paramMap.get('id') || '';
    this.loadSubscriptionDetails();
  }

  loadSubscriptionDetails(): void {
    this.loading = true;
    
    // Simulate API call - replace with actual service call
    setTimeout(() => {
      this.subscription = {
        id: parseInt(this.subscriptionId),
        reference: `SUB-${this.subscriptionId.padStart(6, '0')}`,
        status: 'In Progress',
        submissionDate: '2024-08-15',
        lastUpdated: '2024-08-20',
        
        personalDetails: {
          firstName: 'John',
          middleName: 'Michael',
          lastName: 'Doe',
          email: 'john.doe@email.com',
          phone: '+234 803 123 4567',
          dateOfBirth: '1990-05-15',
          nationality: 'Nigerian',
          idNumber: 'NIN-12345678901',
          maritalStatus: 'Married',
          address: '123 Main Street, Victoria Island, Lagos State'
        },
        
        nextOfKinDetails: {
          fullName: 'Jane Smith Doe',
          relationship: 'Spouse',
          phone: '+234 803 987 6543',
          email: 'jane.doe@email.com',
          address: '123 Main Street, Victoria Island, Lagos State'
        },
        
        employmentDetails: {
          employmentStatus: 'Employed',
          employerName: 'Tech Solutions Ltd',
          jobTitle: 'Software Engineer',
          workAddress: '456 Business District, Ikeja, Lagos',
          monthlyIncome: '₦2,500,000',
          yearsOfEmployment: '5'
        },
        
        paymentDetails: {
          propertyPurchased: 'Royal Gardens Estate - Block A',
          totalUnits: 2,
          unitPrice: '₦45,000,000',
          totalAmount: '₦90,000,000',
          paymentPlan: 'Installmental (24 months)',
          sourceOfFunds: 'Employment Income',
          propertyUsage: 'Personal Residence',
          initialDeposit: '₦18,000,000'
        },
        
        realtorDetails: {
          name: 'Sarah Johnson',
          licenseNumber: 'REL-2024-0123',
          phone: '+234 802 555 1234',
          email: 'sarah.j@aceroyal.com',
          agency: 'Ace Royal Estates'
        },
        
        customerDetails: {
          preferredContactMethod: 'Email',
          hearAboutUs: 'Social Media',
          additionalRequests: 'Close to schools and hospitals',
          investmentGoals: 'Long-term investment and personal residence'
        }
      };
      
      this.loading = false;
    }, 1000);
  }

  onBack(): void {
    this.router.navigate(['/main/subscriptions']);
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
}
