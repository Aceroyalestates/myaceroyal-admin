import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../../core/guards';

const routes: Routes = [
	{
		path: '',
		component: MainComponent,
		canActivate: [AuthGuard],
		canActivateChild: [AuthGuard],
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'dashboard',
			},
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { animation: 'Dashboard' },
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('./user-management/user-management.module').then(
            (m) => m.UserManagementModule,
          ),
        data: { animation: 'Users' },
      },
      {
        path: 'realtor-management',
        loadChildren: () =>
          import('./realtor-management/realtor-management.module').then(
            (m) => m.RealtorManagementModule,
          ),
        data: { animation: 'Realtors' },
      },
      {
        path: 'admin-management',
        loadChildren: () =>
          import('./admin-management/admin-management.module').then(
            (m) => m.AdminManagementModule,
          ),
        data: { animation: 'Admins' },
      },
      {
        path: 'property-management',
        loadChildren: () =>
          import('./property-management/property-management.module').then(
            (m) => m.PropertyManagementModule,
          ),
        data: { animation: 'Properties' },
      },
      {
        path: 'finance-management',
        loadChildren: () =>
          import('./finance-management/finance-management.module').then(
            (m) => m.FinanceManagementModule,
          ),
        data: { animation: 'Finance' },
      },
      {
        path: 'subscriptions',
        loadChildren: () =>
          import('./subscriptions/subscriptions.module').then(
            (m) => m.SubscriptionsModule,
          ),
        data: { animation: 'Subscriptions' },
      },
      {
        path: 'legal',
        loadChildren: () =>
          import('./legal/legal.module').then(
            (m) => m.LegalModule,
          ),
        data: { animation: 'Legal' },
      },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MainRoutingModule {}
