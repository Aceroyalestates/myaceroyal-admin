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
    { key: 'property', title: 'Property', sortable: true, type: 'text' },
    { key: 'invoice', title: 'Invoice #', sortable: true, type: 'text' },
    { key: 'amountPaid', title: 'Amount', sortable: true, type: 'text' },
    { key: 'paymentDate', title: 'Date', sortable: true, type: 'date' },
    { key: 'status', title: 'Status', sortable: true, type: 'status' },
  ];

  actions: TableAction[] = [
    { key: 'view', label: 'View Details', color: '#E41C24', tooltip: 'View details' }
  ];

  rowsAll: any[] = [];
  rows: any[] = [];

  // Client-side filter helpers
  selectedProperty = '';
  selectedRealtor = '';
  propertyOptions: string[] = [];
  realtorOptions: string[] = [];

  constructor(private finance: FinanceService, private router: Router) {}

  ngOnInit(): void {
    this.fetch();
  }

  onSearch(term: any) {
    this.searchTerm = String(term ?? '');
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
        this.rowsAll = data;
        this.buildFilterOptions();
        this.applyClientFilters();
        // Basic metrics
        this.metrics[0].value = this.rows.length; // pending docs (approx by filter)
        this.metrics[2].value = this.rows.length; // total approved in current view
      },
      error: () => { this.rowsAll = []; this.rows = []; },
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
      status: (t.status || '').toString(),
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

  private buildFilterOptions(): void {
    const props = new Set<string>();
    const realtors = new Set<string>();
    for (const r of this.rowsAll) {
      if (r.property && r.property !== '—') props.add(r.property);
      if (r.realtor && r.realtor !== '—') realtors.add(r.realtor);
    }
    this.propertyOptions = Array.from(props).sort();
    this.realtorOptions = Array.from(realtors).sort();
  }

  onPropertyChange(val: string) { this.selectedProperty = val || ''; this.applyClientFilters(); }
  onRealtorChange(val: string) { this.selectedRealtor = val || ''; this.applyClientFilters(); }

  private applyClientFilters(): void {
    const term = (this.searchTerm || '').toLowerCase();
    this.rows = this.rowsAll.filter(r => {
      const okTerm = !term || (r.client?.toLowerCase().includes(term) || r.email?.toLowerCase().includes(term) || r.property?.toLowerCase().includes(term) || r.invoice?.toLowerCase().includes(term));
      const okProp = !this.selectedProperty || r.property === this.selectedProperty;
      const okRealtor = !this.selectedRealtor || r.realtor === this.selectedRealtor;
      return okTerm && okProp && okRealtor;
    });
  }

  onExport(): void {
    const headers = [
      'Client','Email','Address','Property','Unit','Payment Type','Invoice #','Total Price','Initial Payment','Initial Payment Date','Status','Realtor'
    ];
    const csvRows = [headers.join(',')];
    for (const r of this.rows) {
      const line = [
        r.client, r.email, r.address, r.property, r.unit, r.paymentType, r.invoice,
        r.totalPrice, r.amountPaid, r.paymentDate, r.status, r.realtor
      ].map((v: any) => '"' + String(v ?? '').replace(/"/g, '""') + '"').join(',');
      csvRows.push(line);
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'legal-transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
}
