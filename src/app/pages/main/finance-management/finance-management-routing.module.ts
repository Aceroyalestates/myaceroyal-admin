import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceManagementComponent } from './finance-management.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FinanceManagementComponent,
  },
  {
    path: 'transaction/:id',
    component: TransactionDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceManagementRoutingModule {}
