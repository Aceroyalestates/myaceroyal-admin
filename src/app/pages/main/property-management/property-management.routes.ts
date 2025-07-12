import { Routes } from '@angular/router';
import { AddPropertyComponent } from './add-property/add-property.component';
import { EditPropertyComponent } from './edit-property/edit-property.component';
import { PropertyManagementComponent } from './property-management.component';
import { ViewPropertyComponent } from './view-property/view-property.component';

export const propertyManagementRoutes: Routes = [
  {
    path: '',
    component: PropertyManagementComponent,
    children: [
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
    ]
  }
];

