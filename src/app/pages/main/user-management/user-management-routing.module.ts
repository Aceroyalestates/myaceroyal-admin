import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewUserComponent } from './veiw-user/veiw-user.component';
import { ViewUserPropertyComponent } from './view-user-property/view-user-property.component';
import { UserManagementComponent } from './user-management.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UserManagementComponent,
  },
  {
    path: 'view/:id',
    component: ViewUserComponent,
  },
  {
    path: 'view/:id/:slug',
    component: ViewUserPropertyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule {}
