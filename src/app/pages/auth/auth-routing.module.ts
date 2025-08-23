import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NoAuthGuard } from '../../core/guards';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent,
		canActivate: [NoAuthGuard],
	},
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AuthRoutingModule {}
