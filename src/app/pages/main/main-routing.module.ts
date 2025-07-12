import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { VeiwUserComponent } from './user-management/veiw-user/veiw-user.component';
import { ViewUserPropertyComponent } from './user-management/view-user-property/view-user-property.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
      },
      {
        path: 'user-management/view/:id',
        component: VeiwUserComponent,
      },
      {
        path: 'user-management/view/:id/:slug',
        component: ViewUserPropertyComponent,
      },
      {
        path: 'property-management',
        loadChildren: () => import('../main/property-management/property-management.routes').then(m => m.propertyManagementRoutes),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
