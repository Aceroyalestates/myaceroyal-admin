import { Routes } from '@angular/router';
import { UnauthorizedComponent } from './pages/auth/unauthorized/unauthorized.component';
import { NotFoundComponent } from './pages/auth/not-found/not-found.component';

export const routes: Routes = [
      {
    path: '',
    loadChildren: () => import('../app/pages/main/main.module').then(m => m.MainModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('../app/pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];
