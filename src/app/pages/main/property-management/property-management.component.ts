import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { Properties } from 'src/app/core/constants';
import { TableColumn, TableAction } from 'src/app/shared/components/table/table.component';
import { PropertyService } from 'src/app/core/services/property.service';
import { Property } from 'src/app/core/models/properties';
import { Router } from '@angular/router';


@Component({
  selector: 'app-property-management',
  imports: [CommonModule, SharedModule, NzTabsModule, NzCardModule],
  templateUrl: './property-management.component.html',
  styleUrl: './property-management.component.css',
})
export class PropertyManagementComponent {

  propertyList: any[] = [];
  loading = false;
  error: string | null = null;

  properties: Property[] = [];
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
        key: 'property_type.name',
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
        key: 'unit_type_name',
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
        key: 'unit_price',
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

    constructor(
      private propertyService: PropertyService,
      private router: Router
    ) {
      effect(() => {
        console.log('Selected property from table: ', this.selectedproperty());
        this.loadProperties();
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
      console.log('Row clicked:', row);
      // Navigate to property details
      this.router.navigate([`/main/property-management/view/${row.id}`]);
      // window.location.href = `/property-management/view/${row.id}`;
  }

    addNewProperty() {
      console.log('Adding new property');
      // Navigate to add property page
      this.router.navigate(['/main/property-management/add']);
    }

    viewProperty(property: Property) {
      console.log('Viewing property:', property);
      // window.location.href = `/property-management/view/${property.id}`;
      this.router.navigate([`/main/property-management/view/${property.id}`]);
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

      loadProperties() {
        this.loading = true;
      this.propertyService.getProperties(1, 10, { })
        .subscribe({
          next: (response) => {
            // Preprocess properties to add unit_type_name
            this.properties = response.data.map((property: any) => ({
              ...property,
              unit_type_name: property.property_units && property.property_units.length > 0 && property.property_units[0].unit_type ? property.property_units[0].unit_type.name : '',
              quantity: property.property_units ? property.property_units.length : 0,
              unit_price: property.property_units && property.property_units.length > 0 && property.property_units[0].price !== undefined
                ? formatNaira(property.property_units[0].price)
                : ''
            }));
            this.loading = false;
            console.log(this.properties); // Property array
            console.log(response.pagination); // Pagination info
          },
          error: (error) => {
            console.error('Error fetching properties:', error);
            this.loading = false;
            this.error = 'Failed to load properties';
          }
        });
    }

}


const formatNaira = (value: number): string => {
  return '₦' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export interface WithDates { createdAt?: string }
