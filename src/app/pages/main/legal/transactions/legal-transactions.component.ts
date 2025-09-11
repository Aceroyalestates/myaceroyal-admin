import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { FinanceService } from 'src/app/core/services/finance.service';
import { FinanceTransaction } from 'src/app/core/models/finance';

@Component({
  selector: 'app-legal-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    NzCardModule,
    NzTagModule,
    NzButtonModule,
    SharedModule
  ],
  templateUrl: './legal-transactions.component.html'
})
export class LegalTransactionsComponent implements OnInit {
  loading = false;
  // Metrics
  metrics = [
    { id: 1, title: 'Pending Documentation', value: 0, color: '#F59E0B' },
    { id: 2, title: 'Contracts Sent', value: 0, color: '#10B981' },
    { id: 3, title: 'Total Approved', value: 0, color: '#3B82F6' },
    { id: 4, title: 'Issues / Reupload', value: 0, color: '#EF4444' },
  ];

  // Filters
  searchTerm = '';
  statusFilter = 'approved'; // default fetch approved/pending-docs

  // Table
  columns: TableColumn[] = [
    { key: 'client', title: 'Client', sortable: true, type: 'text' },
    { key: 'email', title: 'Email', sortable: true, type: 'text' },
    { key: 'address', title: 'Address', sortable: false, type: 'text' },
    { key: 'property', title: 'Property', sortable: true, type: 'text' },
    { key: 'unit', title: 'Unit', sortable: true, type: 'text' },
    { key: 'paymentType', title: 'Payment Type', sortable: true, type: 'text' },
    { key: 'invoice', title: 'Invoice #', sortable: true, type: 'text' },
    { key: 'totalPrice', title: 'Total Price', sortable: true, type: 'text' },
    { key: 'amountPaid', title: 'Initial Payment', sortable: true, type: 'text' },
    { key: 'paymentDate', title: 'Initial Payment Date', sortable: true, type: 'date' },
    { key: 'realtor', title: 'Realtor', sortable: true, type: 'text' },
  ];

  actions: TableAction[] = [
    { key: 'view', label: 'View Details', color: '#E41C24', tooltip: 'View details' }
  ];

  rows: any[] = [];

  constructor(private finance: FinanceService, private router: Router) {}

  ngOnInit(): void {
    this.fetch();
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.fetch();
  }

  onStatusChange(val: string) {
    this.statusFilter = val;
    this.fetch();
  }

  onAction(e: { action: string; row: any }) {
    if (e.action === 'view') {
      this.router.navigate(['/main/legal/transactions', e.row.id]);
    }
  }

  private fetch() {
    this.loading = true;
    // Map legal perspective statuses; default to approved/pending docs
    const params: any = { page: 1, limit: 20, sort_by: 'createdAt', sort_order: 'DESC' };
    if (this.statusFilter) params.status = this.statusFilter;
    this.finance.getTransactions(params).subscribe({
      next: (res) => {
        const data = (res.data || []).map((t: FinanceTransaction) => this.toRow(t));
        this.rows = data;
        // Basic metrics
        this.metrics[0].value = data.length; // pending docs (approx by filter)
        this.metrics[2].value = data.length; // total approved in current view
      },
      error: () => { this.rows = []; },
      complete: () => { this.loading = false; }
    });
  }

  private toRow(t: any) {
    const purchase = t.purchase || {};
    const unit = purchase.unit || {};
    const property = unit.property || {};
    const payer = t.payer || purchase.buyer || {};
    const realtorName = t.realtor?.full_name || t.realtor_name || '—';
    const realtorEmail = t.realtor?.email || t.realtor_email || '';
    return {
      id: String(t.id || ''),
      client: payer.full_name || '—',
      email: payer.email || '—',
      address: payer.address || '—',
      property: property.name || '—',
      unit: unit.id ? String(unit.id) : (unit.name || '—'),
      paymentType: purchase.plan_id ? 'Installment' : 'Outright',
      invoice: t.payment_reference || t.reference || '—',
      totalPrice: purchase.total_price ? ('₦ ' + Number(purchase.total_price).toLocaleString()) : '—',
      amountPaid: t.amount ? ('₦ ' + Number(t.amount).toLocaleString()) : '—',
      paymentDate: t.paid_at || t.createdAt || '',
      realtor: realtorName + (realtorEmail ? ` (${realtorEmail})` : ''),
    };
  }

  getTransparentColor(hex: string): string {
    if (!hex || !hex.startsWith('#')) return hex || 'transparent';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.12)`;
  }
}

