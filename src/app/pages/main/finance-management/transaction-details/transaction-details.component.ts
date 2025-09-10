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
import { FinanceService } from 'src/app/core/services/finance.service';
import { FinanceTransaction } from 'src/app/core/models/finance';

interface TransactionDetail {
  id: string;
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

  // No mock data; use API

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private message: NzMessageService,
    private financeService: FinanceService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.transactionId = params.get('id');
      console.log('[TransactionDetailsComponent] ngOnInit -> transactionId', this.transactionId);
      if (this.transactionId) {
        this.loadTransactionDetails(this.transactionId);
      }
    });
  }

  loadTransactionDetails(id: string): void {
    this.loading = true;

    console.log('[TransactionDetailsComponent] loadTransactionDetails -> id', id);
    this.financeService.getTransactionById(id).subscribe({
      next: (t) => {
        console.log('[TransactionDetailsComponent] loadTransactionDetails -> response', t);
        this.transaction = this.mapToDetail(t);
      },
      error: (err) => {
        console.error('[TransactionDetailsComponent] loadTransactionDetails -> error', err);
        this.transaction = null;
      },
      complete: () => {
        console.log('[TransactionDetailsComponent] loadTransactionDetails -> complete');
        this.loading = false;
      }
    });
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
    if (!this.transaction) return;
    this.financeService.updateTransaction(this.transaction.id, { action: 'approve', comment: 'Approved and sent to legal' })
      .subscribe({
        next: () => {
          this.message.success('Transaction approved and sent to legal team for document processing');
          this.transaction!.status = 'Approved - Legal Processing';
        }
      });
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

    if (!this.transaction) return;
    this.financeService.updateTransaction(this.transaction.id, { action: 'review', comment: this.reviewComment })
      .subscribe({
        next: () => {
          this.transaction!.status = 'Under Review';
          this.message.success('Transaction sent for review with comments');
          this.isReviewModalVisible = false;
          this.reviewComment = '';
        }
      });
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

    if (!this.transaction) return;
    this.financeService.updateTransaction(this.transaction.id, { action: 'reject', reason: this.rejectComment })
      .subscribe({
        next: () => {
          this.transaction!.status = 'Rejected';
          this.message.success('Transaction rejected successfully');
          this.isRejectModalVisible = false;
          this.rejectComment = '';
        }
      });
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
    if (!this.transaction) return;
    this.financeService.updateTransaction(this.transaction.id, { action: 'approve', comment: this.validateComment })
      .subscribe({
        next: () => {
          this.transaction!.status = 'Approved - Legal Processing';
          this.message.success('Transaction validated and sent to legal team with instructions');
          this.isValidateModalVisible = false;
          this.validateComment = '';
        }
      });
  }

  handleValidateCancel(): void {
    this.isValidateModalVisible = false;
    this.validateComment = '';
  }

  private formatCurrency(value: any): string {
    const num = Number(value);
    if (isNaN(num)) return String(value ?? '₦0');
    return '₦' + num.toLocaleString();
  }

  private mapToDetail(t: FinanceTransaction): TransactionDetail {
    const anyT = t as any;
    const amount = anyT['amount'];
    const fee = anyT['fee'];
    return {
      id: String(anyT['id'] ?? ''),
      paymentType: anyT['payment_type'] || anyT['type'] || 'Payment',
      client: anyT['user']?.['full_name'] || anyT['customer_name'] || anyT['client'] || '—',
      modeOfPayment: anyT['method'] || anyT['mode'] || '—',
      amount: this.formatCurrency(amount),
      date: anyT['createdAt'] || anyT['date'] || '',
      status: String(anyT['status'] || 'pending'),
      property: anyT['property']?.['name'] || anyT['property_name'] || '—',
      reference: anyT['reference'] || anyT['ref'] || '—',
      description: anyT['description'] || '',
      clientEmail: anyT['user']?.['email'] || anyT['client_email'] || '',
      clientPhone: anyT['user']?.['phone'] || anyT['client_phone'] || '',
      paymentMethod: anyT['method'] || '—',
      transactionFee: this.formatCurrency(fee),
      netAmount: this.formatCurrency(anyT['net_amount'] ?? (Number(amount || 0) - Number(fee || 0))),
      evidenceOfPayment: anyT['evidence_url'] || anyT['receipt_url'],
    };
  }
}
