import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionsComponent } from './subscriptions.component';
import { ReportComponent } from './report/report.component';
import { SubscriptionDetailsComponent } from './subscription-details/subscription-details.component';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionsComponent
  },
  {
    path: 'report',
    component: ReportComponent
  },
  {
    path: 'details/:id',
    component: SubscriptionDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionsRoutingModule { }
