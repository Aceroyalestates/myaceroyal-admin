import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagementComponent } from './admin-management.component';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { AddAdminComponent } from './add-admin/add-admin.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AdminManagementComponent,
  },
  {
    path: 'details/:id',
    component: AdminDetailsComponent,
  },
  {
    path: 'new',
    component: AddAdminComponent,
  },
  {
    path: 'new/:id',
    component: AddAdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminManagementRoutingModule {}
