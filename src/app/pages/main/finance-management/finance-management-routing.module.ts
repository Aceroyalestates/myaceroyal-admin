import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceManagementComponent } from './finance-management.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: FinanceManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceManagementRoutingModule {}
