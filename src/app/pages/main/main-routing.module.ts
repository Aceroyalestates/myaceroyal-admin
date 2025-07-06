import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

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
      ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
