import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { propertyManagementRoutes } from './property-management.routes';
import { PropertyManagementComponent } from './property-management.component';
import { ViewPropertyComponent } from './view-property/view-property.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';

const routes: Routes = [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: PropertyManagementComponent
      },
      {
        path: 'view/:id',
        component: ViewPropertyComponent
      },
      {
        path: 'add',
        component: AddPropertyComponent
      },
      {
        path: 'edit/:id',
        component: EditPropertyComponent
      }
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyManagementRoutingModule { }
