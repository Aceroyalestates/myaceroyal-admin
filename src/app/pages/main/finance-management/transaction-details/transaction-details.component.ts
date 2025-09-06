import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';

interface TransactionDetail {
  id: number;
  paymentType: string;
  client: string;
  modeOfPayment: string;
  amount: string;
  date: string;
  status: string;
  property: string;
  reference: string;
  description: string;
  clientEmail: string;
  clientPhone: string;
  paymentMethod: string;
  transactionFee: string;
  netAmount: string;
  evidenceOfPayment?: string; // URL to evidence document/image
}

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzDescriptionsModule,
    NzTagModule,
    NzSpinModule,
    NzEmptyModule,
    NzDividerModule,
    NzModalModule,
    NzInputModule,
    NzFormModule,
    NzRadioModule,
    BreadcrumbComponent
  ],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {
  transactionId: string | null = null;
  transaction: TransactionDetail | null = null;
  loading = true;

  // Modal states
  isReviewModalVisible = false;
  isRejectModalVisible = false;
  isSendToClientModalVisible = false;
  isValidateModalVisible = false;
  
  // Form data
  reviewComment = '';
  rejectComment = '';
  validateComment = '';
  sendToClientType = 'receipt'; // 'receipt' or 'invoice'

  // Mock transaction data - replace with actual API call
  private mockTransactions: TransactionDetail[] = [
    {
      id: 1,
      paymentType: 'Property Purchase',
      client: 'John Doe',
      modeOfPayment: 'Bank Transfer',
      amount: '₦2,500,000',
      date: '2024-01-15',
      status: 'Pending Review',
      property: 'Luxury Apartment - Block A, Unit 12',
      reference: 'TXN-2024-001-LP',
      description: 'Initial payment for luxury apartment purchase',
      clientEmail: 'john.doe@email.com',
      clientPhone: '+234 801 234 5678',
      paymentMethod: 'First Bank Transfer',
      transactionFee: '₦12,500',
      netAmount: '₦2,487,500',
      evidenceOfPayment: 'assets/documents/bank-transfer-receipt.pdf'
    },
    {
      id: 2,
      paymentType: 'Rent Payment',
      client: 'Jane Smith',
      modeOfPayment: 'Paystack',
      amount: '₦500,000',
      date: '2024-01-10',
      status: 'Successful',
      property: 'Office Complex - Floor 3, Suite 305',
      reference: 'TXN-2024-002-RC',
      description: 'Monthly rent payment for office space',
      clientEmail: 'jane.smith@email.com',
      clientPhone: '+234 802 345 6789',
      paymentMethod: 'Paystack - Debit Card',
      transactionFee: '₦7,500',
      netAmount: '₦492,500'
      // No evidenceOfPayment for Paystack - it's automatic
    },
    {
      id: 3,
      paymentType: 'Service Fee',
      client: 'Mike Johnson',
      modeOfPayment: 'Bank Transfer',
      amount: '₦150,000',
      date: '2024-01-12',
      status: 'Pending Review',
      property: 'Commercial Space - Unit B2',
      reference: 'TXN-2024-003-SF',
      description: 'Service fee payment for property management',
      clientEmail: 'mike.johnson@email.com',
      clientPhone: '+234 803 456 7890',
      paymentMethod: 'UBA Bank Transfer',
      transactionFee: '₦2,250',
      netAmount: '₦147,750'
      // No evidenceOfPayment property - means no evidence uploaded yet
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.transactionId = params.get('id');
      if (this.transactionId) {
        this.loadTransactionDetails(this.transactionId);
      }
    });
  }

  loadTransactionDetails(id: string): void {
    this.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      const transaction = this.mockTransactions.find(t => t.id.toString() === id);
      this.transaction = transaction || null;
      this.loading = false;
    }, 1000);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'successful':
      case 'completed':
        return 'success';
      case 'pending':
      case 'pending review':
        return 'warning';
      case 'failed':
      case 'rejected':
        return 'error';
      case 'under review':
        return 'processing';
      default:
        return 'default';
    }
  }

  // Navigation methods
  onBack(): void {
    this.router.navigate(['/main/finance-management']);
  }

  // Transaction status checks
  isPaystackTransaction(): boolean {
    return this.transaction?.modeOfPayment.toLowerCase() === 'paystack';
  }

  isBankTransferOrCheck(): boolean {
    const mode = this.transaction?.modeOfPayment.toLowerCase();
    return mode === 'bank transfer' || mode === 'check';
  }

  isSuccessfulTransaction(): boolean {
    return this.transaction?.status.toLowerCase() === 'successful';
  }

  isPendingReview(): boolean {
    return this.transaction?.status.toLowerCase() === 'pending review';
  }

  isRejected(): boolean {
    return this.transaction?.status.toLowerCase() === 'rejected';
  }

  isApproved(): boolean {
    const status = this.transaction?.status.toLowerCase();
    return status === 'approved' || status === 'approved - legal processing';
  }

  canTakeActions(): boolean {
    const status = this.transaction?.status.toLowerCase();
    // Can take actions if transaction is either "Successful" (Paystack) or "Pending Review" (Bank Transfer)
    // but not if already approved or rejected
    return (status === 'successful' || status === 'pending review') && 
           !this.isRejected() && 
           !this.isApproved();
  }

  hasEvidenceOfPayment(): boolean {
    return !!this.transaction?.evidenceOfPayment;
  }

  // Action methods
  onDownloadEvidence(): void {
    if (this.transaction?.evidenceOfPayment) {
      // In a real app, this would download the actual file
      this.message.success('Evidence of payment downloaded successfully');
      console.log('Download evidence:', this.transaction.evidenceOfPayment);
    }
  }

  onDownloadReceipt(): void {
    this.onDownloadEvidence();
  }

  onApproveAndSendToLegal(): void {
    if (this.transaction) {
      this.message.success('Transaction approved and sent to legal team for document processing');
      // Update transaction status
      this.transaction.status = 'Approved - Legal Processing';
    }
  }

  onValidateTransaction(): void {
    this.showValidateModal();
  }

  showValidateModal(): void {
    this.isValidateModalVisible = true;
    this.validateComment = '';
  }

  // Modal methods
  showReviewModal(): void {
    this.isReviewModalVisible = true;
    this.reviewComment = '';
  }

  showRejectModal(): void {
    this.isRejectModalVisible = true;
    this.rejectComment = '';
  }

  showSendToClientModal(): void {
    this.isSendToClientModalVisible = true;
    this.sendToClientType = 'receipt';
  }

  // Review transaction
  handleReviewOk(): void {
    if (!this.reviewComment.trim()) {
      this.message.error('Please provide review comments');
      return;
    }

    if (this.transaction) {
      this.transaction.status = 'Under Review';
      this.message.success('Transaction sent for review with comments');
      this.isReviewModalVisible = false;
      this.reviewComment = '';
    }
  }

  handleReviewCancel(): void {
    this.isReviewModalVisible = false;
    this.reviewComment = '';
  }

  // Reject transaction
  handleRejectOk(): void {
    if (!this.rejectComment.trim()) {
      this.message.error('Please provide rejection reason');
      return;
    }

    if (this.transaction) {
      this.transaction.status = 'Rejected';
      this.message.success('Transaction rejected successfully');
      this.isRejectModalVisible = false;
      this.rejectComment = '';
    }
  }

  handleRejectCancel(): void {
    this.isRejectModalVisible = false;
    this.rejectComment = '';
  }

  // Send to client
  handleSendToClientOk(): void {
    if (this.transaction) {
      const documentType = this.sendToClientType === 'receipt' ? 'Receipt' : 'Invoice';
      this.message.success(`${documentType} sent to ${this.transaction.client} successfully`);
      this.isSendToClientModalVisible = false;
    }
  }

  handleSendToClientCancel(): void {
    this.isSendToClientModalVisible = false;
  }

  handleValidateOk(): void {
    if (!this.validateComment.trim()) {
      this.message.error('Please provide instructions for legal team');
      return;
    }
    if (this.transaction) {
      this.transaction.status = 'Approved - Legal Processing';
      this.message.success('Transaction validated and sent to legal team with instructions');
      this.isValidateModalVisible = false;
      this.validateComment = '';
    }
  }

  handleValidateCancel(): void {
    this.isValidateModalVisible = false;
    this.validateComment = '';
  }
}
