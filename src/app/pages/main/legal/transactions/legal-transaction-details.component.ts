import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FinanceService } from 'src/app/core/services/finance.service';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-legal-transaction-details',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzDescriptionsModule, NzButtonModule, NzTagModule, BreadcrumbComponent],
  templateUrl: './legal-transaction-details.component.html'
})
export class LegalTransactionDetailsComponent implements OnInit {
  id = '';
  loading = false;
  tx: any = null;
  sending = false;

  constructor(private route: ActivatedRoute, private router: Router, private finance: FinanceService, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.fetch();
  }

  fetch() {
    if (!this.id) return;
    this.loading = true;
    this.finance.getTransactionById(this.id).subscribe({
      next: (t) => { this.tx = t; },
      error: () => { this.tx = null; },
      complete: () => { this.loading = false; }
    });
  }

  markContractSent() {
    if (!this.id) return;
    this.sending = true;
    this.finance.updateTransaction(this.id, { action: 'contract_sent' }).subscribe({
      next: () => { this.msg.success('Status updated to Contract Sent'); },
      error: () => { this.msg.error('Failed to update status'); },
      complete: () => { this.sending = false; }
    });
  }
}
