import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
        loadChildren: () =>
          import('./user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: 'realtor-management',
        loadChildren: () =>
          import('./realtor-management/realtor-management.module').then(
            (m) => m.RealtorManagementModule
          ),
      },
      {
        path: 'admin-management',
        loadChildren: () =>
          import('./admin-management/admin-management.module').then(
            (m) => m.AdminManagementModule
          ),
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
