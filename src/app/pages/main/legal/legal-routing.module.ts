import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalComponent } from './legal.component';
import { LegalTransactionsComponent } from './transactions/legal-transactions.component';
import { LegalTransactionDetailsComponent } from './transactions/legal-transaction-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'transactions', pathMatch: 'full' },
  { path: 'transactions', component: LegalTransactionsComponent },
  { path: 'transactions/:id', component: LegalTransactionDetailsComponent },
  { path: 'dashboard', component: LegalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalRoutingModule { }
