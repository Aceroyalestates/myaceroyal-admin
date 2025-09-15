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
import { FinanceTransaction, UpdateTransactionRequest } from 'src/app/core/models/finance';

interface TransactionDetail {
  id: string;
  paymentType: string; // e.g. Purchase Payment
  client: string;
  modeOfPayment: string; // method
  amount: string;
  date: string; // createdAt
  status: string;
  property: string; // purchase.unit.property.name
  reference: string; // payment_reference
  gatewayReference?: string; // gateway_reference
  description: string;
  clientEmail: string;
  clientPhone: string;
  paymentMethod: string; // method
  transactionFee: string;
  netAmount: string;
  evidenceOfPayment?: string; // proof_url or receipt_url
  errorMessage?: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  paidAt?: string | null;
  reviewNote?: string | null;
  reuploadRequested?: boolean;
  reuploadMessage?: string | null;
  rejectionReason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  // Purchase context
  purchase?: {
    id?: string;
    totalPrice?: string;
    initialPaymentDue?: string;
    balanceDue?: string;
    status?: string;
    paymentMethod?: string;
    propertyName?: string;
    propertyLocation?: string;
    unitId?: number | string;
    unitPrice?: string;
  };
  appliedTo?: any;
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
  approveLoading = false;

  // Modal states
  isReviewModalVisible = false;
  isSendToClientModalVisible = false;
  isValidateModalVisible = false;
  isEditModalVisible = false;
  validateLoading = false;
  
  // Form data
  reviewComment = '';
  reviewDecision: 'request_reupload' | 'reinitiate' = 'request_reupload';
  validateComment = '';
  sendToClientType = 'receipt'; // 'receipt' or 'invoice'
  selectedProofFile: File | null = null;

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
    const mode = (this.transaction?.modeOfPayment || '').toLowerCase();
    return mode === 'paystack';
  }

  isBankTransferOrCheck(): boolean {
    const mode = (this.transaction?.modeOfPayment || '').toLowerCase();
    return mode === 'bank transfer' || mode === 'check' || mode === 'cheque';
  }

  isSuccessfulTransaction(): boolean {
    const s = (this.transaction?.status || '').toLowerCase();
    return s === 'successful' || s === 'approved' || s === 'completed';
  }

  isPendingReview(): boolean {
    const s = (this.transaction?.status || '').toLowerCase();
    return s === 'pending review' || s === 'pending' || s === 'in_review';
  }

  isRejected(): boolean {
    const s = (this.transaction?.status || '').toLowerCase();
    return s === 'rejected' || s === 'failed';
  }

  canApprovePaystack(): boolean {
    if (!this.transaction) return false;
    if (!this.isPaystackTransaction()) return false;
    const s = (this.transaction.status || '').toLowerCase();
    // Paystack payments are successful by default; allow approve when not yet approved/rejected
    return s !== 'approved' && s !== 'rejected' && s !== 'failed';
  }

  isApproved(): boolean {
    const status = this.transaction?.status.toLowerCase();
    return status === 'approved' || status === 'approved - legal processing';
  }

  canTakeActions(): boolean {
    const s = (this.transaction?.status || '').toLowerCase();
    // Allow actions on pending/in_review/successful, but not if approved/rejected
    return (s === 'pending' || s === 'pending review' || s === 'in_review' || s === 'successful') && !this.isRejected() && !this.isApproved();
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

  showEditModal(): void {
    this.isEditModalVisible = true;
    this.selectedProofFile = null;
  }

  handleEditOk(): void {
    if (!this.transaction || !this.selectedProofFile) {
      this.message.error('Please select a file to upload');
      return;
    }
    this.financeService.uploadTransactionProof(this.transaction.id, this.selectedProofFile).subscribe({
      next: () => {
        this.message.success('Proof of payment uploaded successfully');
        this.isEditModalVisible = false;
        this.selectedProofFile = null;
        // Reload to reflect new proof URL if backend returns it on GET
        this.loadTransactionDetails(this.transaction!.id);
      },
      error: () => {
        this.message.error('Failed to upload proof of payment');
      }
    });
  }

  handleEditCancel(): void {
    this.isEditModalVisible = false;
    this.selectedProofFile = null;
  }

  onProofFileChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input && input.files && input.files.length > 0 ? input.files[0] : null;
    this.selectedProofFile = file;
  }

  onDownloadReceipt(): void {
    this.onDownloadEvidence();
  }

  onApproveAndSendToLegal(): void {
    if (!this.transaction) return;
    this.approveLoading = true;
    this.financeService.updateTransaction(this.transaction.id, { action: 'approve', comment: 'Approved and sent to legal' })
      .subscribe({
        next: () => {
          this.message.success('Transaction approved and sent to legal team for document processing');
          this.transaction!.status = 'Approved - Legal Processing';
        },
        error: () => {
          this.message.error('Failed to approve transaction');
        },
        complete: () => {
          this.approveLoading = false;
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

  showSendToClientModal(): void {
    this.isSendToClientModalVisible = true;
    this.sendToClientType = 'receipt';
  }

  // Review decision (request reupload or reinitiate)
  handleReviewOk(): void {
    if (!this.transaction) return;
    const action = this.reviewDecision === 'request_reupload' ? 'request_reupload' : 'reinitiate';
    const payload: UpdateTransactionRequest = { action, message: this.reviewComment || undefined } as any;
    this.financeService.updateTransaction(this.transaction.id, payload)
      .subscribe({
        next: () => {
          const msg = this.reviewDecision === 'request_reupload' ? 'Requested reupload of proof from user' : 'Requested user to reinitiate transaction';
          this.message.success(msg);
          this.isReviewModalVisible = false;
          this.reviewComment = '';
          // Mark locally
          if (this.reviewDecision === 'request_reupload') {
            if (this.transaction) {
              this.transaction.reuploadRequested = true;
              this.transaction.reuploadMessage = payload.message || '';
            }
          }
        }
      });
  }

  handleReviewCancel(): void {
    this.isReviewModalVisible = false;
    this.reviewComment = '';
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
    this.validateLoading = true;
    this.financeService.updateTransaction(this.transaction.id, { action: 'approve', comment: this.validateComment })
      .subscribe({
        next: () => {
          this.transaction!.status = 'Approved - Legal Processing';
          this.message.success('Transaction validated and sent to legal team with instructions');
          this.isValidateModalVisible = false;
          this.validateComment = '';
        },
        error: () => {
          this.message.error('Failed to validate and approve transaction');
        },
        complete: () => {
          this.validateLoading = false;
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
    const purchase = anyT['purchase'] || {};
    const unit = purchase['unit'] || {};
    const property = unit['property'] || {};
    return {
      id: String(anyT['id'] ?? ''),
      paymentType: anyT['payment_type'] || anyT['type'] || 'Payment',
      client: anyT['payer']?.['full_name'] || anyT['purchase']?.['buyer']?.['full_name'] || anyT['user']?.['full_name'] || anyT['customer_name'] || anyT['client'] || '—',
      modeOfPayment: anyT['method'] || anyT['payment_method'] || anyT['mode'] || '—',
      amount: this.formatCurrency(amount),
      date: anyT['createdAt'] || anyT['date'] || '',
      status: String(anyT['status'] || 'pending'),
      property: property['name'] || anyT['property']?.['name'] || anyT['property_name'] || '—',
      reference: anyT['payment_reference'] || anyT['reference'] || anyT['ref'] || '—',
      gatewayReference: anyT['gateway_reference'] || undefined,
      description: anyT['description'] || '',
      clientEmail: anyT['payer']?.['email'] || anyT['purchase']?.['buyer']?.['email'] || anyT['user']?.['email'] || anyT['client_email'] || '',
      clientPhone: anyT['payer']?.['phone_number'] || anyT['purchase']?.['buyer']?.['phone_number'] || anyT['user']?.['phone'] || anyT['client_phone'] || '',
      paymentMethod: anyT['method'] || anyT['payment_method'] || '—',
      transactionFee: this.formatCurrency(fee),
      netAmount: this.formatCurrency(anyT['net_amount'] ?? (Number(amount || 0) - Number(fee || 0))),
      evidenceOfPayment: anyT['proof_url'] || anyT['evidence_url'] || anyT['receipt_url'],
      errorMessage: anyT['error_message'] || undefined,
      approvedBy: anyT['approved_by'] || null,
      approvedAt: anyT['approved_at'] || null,
      paidAt: anyT['paid_at'] || null,
      reviewNote: anyT['review_note'] || null,
      reuploadRequested: !!anyT['reupload_requested'],
      reuploadMessage: anyT['reupload_message'] || null,
      rejectionReason: anyT['rejection_reason'] || null,
      reviewedBy: anyT['reviewed_by'] || null,
      reviewedAt: anyT['reviewed_at'] || null,
      createdAt: anyT['createdAt'] || undefined,
      updatedAt: anyT['updatedAt'] || undefined,
      purchase: {
        id: purchase['id'],
        totalPrice: purchase['total_price'],
        initialPaymentDue: purchase['initial_payment_due'],
        balanceDue: purchase['balance_due'],
        status: purchase['status'],
        paymentMethod: purchase['payment_method'],
        propertyName: property['name'],
        propertyLocation: property['location'],
        unitId: unit['id'],
        unitPrice: unit['price'],
      },
      appliedTo: anyT['applied_to'],
    };
  }
}
