import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RealtorManagementComponent } from './realtor-management.component';
import { RealtorDetailsComponent } from './realtor-details/realtor-details.component';
import { AddRealtorComponent } from './add-realtor/add-realtor.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: RealtorManagementComponent,
  },
  {
    path: 'details/:id',
    component: RealtorDetailsComponent,
  },
  {
    path: 'new',
    component: AddRealtorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RealtorManagementRoutingModule {}
