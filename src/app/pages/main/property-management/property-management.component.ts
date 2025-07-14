import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { Property } from 'src/app/core/types/general';
import { Properties } from 'src/app/core/constants';
import { ColumnDef } from '@tanstack/angular-table';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-property-management',
  imports: [CommonModule, SharedModule, NzTabsModule, RouterLink],
  templateUrl: './property-management.component.html',
  styleUrl: './property-management.component.css',
})
export class PropertyManagementComponent {
  properties: Property[] = Properties;
  columns: ColumnDef<Property>[] = [
      { accessorKey: 'name', header: 'Property Name' },
      { accessorKey: 'location', header: 'Location' },
      { accessorKey: 'propertyType', header: 'Property Type' },
      { accessorKey: 'unitType', header: 'Unit Type' },
      { accessorKey: 'quantity', header: 'Listings' },
      { accessorKey: 'price', header: 'Unit Price' },
    ];
    getRowLink = (row: Property) => `/property-management/view/${row.id}`;
    selectedproperty = signal<Property[]>([]);

    constructor() {
      effect(() => {
        console.log('Selected property from table: ', this.selectedproperty());
      })
    }

    handleSelectedData(selected: Property[]) {
        this.selectedproperty.set(selected);
        console.log(this.selectedproperty);
      }
}
