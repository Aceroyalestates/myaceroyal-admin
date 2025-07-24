import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { Property } from 'src/app/core/types/general';
import { Properties } from 'src/app/core/constants';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';


@Component({
  selector: 'app-property-management',
  imports: [CommonModule, SharedModule, NzTabsModule],
  templateUrl: './property-management.component.html',
  styleUrl: './property-management.component.css',
})
export class PropertyManagementComponent {
  properties: Property[] = Properties;
  columns: TableColumn[] = [
      { 
        key: 'name', 
        title: 'Property Name',
        sortable: true,
        type: 'text'
      },
      { 
        key: 'location', 
        title: 'Location',
        sortable: true,
        type: 'text'
      },
      { 
        key: 'propertyType', 
        title: 'Property Type',
        sortable: true,
        filterable: true,
        type: 'text',
        filterOptions: [
          { label: 'Apartment', value: 'Apartment' },
          { label: 'House', value: 'House' },
          { label: 'Villa', value: 'Villa' },
          { label: 'Office', value: 'Office' }
        ]
      },
      { 
        key: 'unitType', 
        title: 'Unit Type',
        sortable: true,
        filterable: true,
        type: 'text',
        filterOptions: [
          { label: '1 Bedroom', value: '1 Bedroom' },
          { label: '2 Bedroom', value: '2 Bedroom' },
          { label: '3 Bedroom', value: '3 Bedroom' },
          { label: 'Studio', value: 'Studio' }
        ]
      },
      { 
        key: 'quantity', 
        title: 'Listings',
        sortable: true,
        type: 'text'
      },
      { 
        key: 'price', 
        title: 'Unit Price',
        sortable: true,
        type: 'text',
        align: 'right'
      },
    ];

    actions: TableAction[] = [
      {
        key: 'view',
        label: 'View',
        icon: 'eye',
        color: 'blue',
        tooltip: 'View details'
      },
      {
        key: 'edit',
        label: 'Edit',
        icon: 'edit',
        color: 'green',
        tooltip: 'Edit property'
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: 'delete',
        color: 'red',
        tooltip: 'Delete property'
      }
    ];
    selectedproperty = signal<Property[]>([]);

    constructor() {
      effect(() => {
        console.log('Selected property from table: ', this.selectedproperty());
      })
    }

    onSelectionChange(selected: Property[]) {
      this.selectedproperty.set(selected);
      console.log('Selected properties:', this.selectedproperty());
    }

    onTableAction(event: { action: string; row: Property }) {
      console.log('Table action:', event.action, 'Row:', event.row);
      switch (event.action) {
        case 'view':
          this.viewProperty(event.row);
          break;
        case 'edit':
          this.editProperty(event.row);
          break;
        case 'delete':
          this.deleteProperty(event.row);
          break;
      }
    }

    onRowClick(row: Property) {
      // Navigate to property details
      window.location.href = `/property-management/view/${row.id}`;
    }

    viewProperty(property: Property) {
      console.log('Viewing property:', property);
      window.location.href = `/property-management/view/${property.id}`;
    }

    editProperty(property: Property) {
      console.log('Editing property:', property);
      // Implement edit functionality
    }

    deleteProperty(property: Property) {
      console.log('Deleting property:', property);
      // Implement delete functionality
    }

    handleSelectedData(selected: Property[]) {
        this.selectedproperty.set(selected);
        console.log(this.selectedproperty);
      }
}
