import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { PropertyService } from 'src/app/core/services/property.service';
import { Property, PropertyFeatureAdmin, PropertyType, PropertyTypeOptions } from 'src/app/core/models/properties';
import { ImageService } from 'src/app/core/services/image.service';

type EditablePropertyFields = 'name' | 'location' | 'description';

@Component({
  selector: 'app-edit-property',
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzStepsModule,
    NzIconModule,
    NzUploadModule,
    NzDividerModule,
    NzCollapseModule
  ],
  templateUrl: './edit-property.component.html',
  styleUrl: './edit-property.component.css'
})

export class EditPropertyComponent implements OnInit, OnDestroy {
id: string | null = null;
property: Property | null = null;
private fb = inject(NonNullableFormBuilder);
private destroy$ = new Subject<void>();
editingName = false;
editingLocation = false;
editingAddress = false;
editingDescription = false;
editingCategory = false;
editingAmenities = false;
editingImages = false;
editForm: FormGroup;
unitTypeForm: FormGroup;
isLoading = false;
propertyTypeOptions: PropertyTypeOptions[] = [];
adminFeatures: PropertyFeatureAdmin[] = [];
currentFeatures: number[] = [];
uploadedImages: string[] = [];
propertyTypes: PropertyType[] = [];

panels = [
    {
      active: true,
      name: '2-Bedroom',
      arrow: true
    },
    {
      active: false,
      arrow: true,
      name: '1-Bedroom',
    }
  ];

  constructor(
    private route: ActivatedRoute, 
    private propertyService: PropertyService,
    private imageService: ImageService
  ) {
      this.editForm = this.fb.group({
      category: this.fb.control(this.property?.property_type.name, [Validators.required]),
      name: this.fb.control(this.property?.name, [Validators.required]),
      location: this.fb.control(this.property?.location, [Validators.required]),
      address: this.fb.control(this.property?.address, [Validators.required]),
      description: this.fb.control(this.property?.description, [Validators.required]),
      amenities: this.fb.control(this.property?.property_features, [Validators.required]),
      images: this.fb.control(this.property?.property_images, [Validators.required])
    });

    this.unitTypeForm = this.fb.group({
      unit_types: this.fb.array([])
    });
    
  }

formAmenities = this.fb.group({
    features: this.fb.control<number[]>(this.currentFeatures, [Validators.required])
  });

  unitForm = this.fb.group({
    unit_type_id: this.fb.control(this.property?.property_units[0].id, [Validators.required]),
    price: this.fb.control(this.property?.property_units[0].price, [Validators.required]),
    total_units: this.fb.control(this.property?.property_units.length, [Validators.required]),
  });

 ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getPropertyById();
      this.getPropertyTypeOptions();
      this.getPropertyAdminFeatures();
      this.getPropertyTypes();
    } else {
      console.error('Property ID is not provided in the route.');
    }
    this.addUnitType();
  }

  // Getter for the unit_types FormArray
  get unitTypes(): FormArray {
    return this.unitTypeForm.get('unit_types') as FormArray;
  }

  // Create a new unit type form group
  createUnitType(): FormGroup {
    return this.fb.group({
      unit_type_id: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      total_units: ['', [Validators.required, Validators.min(1)]]
    });
  }

  // Add a new unit type to the FormArray
  addUnitType(): void {
    this.unitTypes.push(this.createUnitType());
  }

  getPropertyById(): void {
    this.isLoading = true;
    this.propertyService.getPropertyById(this.id!).subscribe(property => {
        this.property = property;
        console.log('Fetched property:', this.property);
        this.isLoading = false;
          this.editForm = this.fb.group({
            property_type: this.fb.control(this.property?.property_type.name, [Validators.required]),
            name: this.fb.control(this.property?.name, [Validators.required]),
            location: this.fb.control(this.property?.location, [Validators.required]),
            address: this.fb.control(this.property?.address, [Validators.required]),
            description: this.fb.control(this.property?.description, [Validators.required]),
            property_features: this.fb.control(this.property?.property_features, [Validators.required]),
            images: this.fb.control(this.property?.property_images, [Validators.required])
          });

          property.property_features.forEach(x => this.currentFeatures.push(x.feature_id));
      });
  }

  getPropertyTypeOptions(): void {
    this.isLoading
    this.propertyService.getPropertytypesOptions().subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Property Type Options:', response);
        this.propertyTypeOptions = response.data || [];
        console.log('Property Type Options:', this.propertyTypeOptions);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching property type options:', error);
      }
    });
  }

  submit(): void {
    if (this.editForm.valid) {
      console.log('submit', this.editForm.value);
    } else {
      Object.values(this.editForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateField(field: any): void {
    console.log('Updating field:', field);
    this.isLoading = true;
    this.propertyService.updateProperty(this.property!.id, field).subscribe({
      next: (response) => {
        console.log('Property updated successfully:', response);
        this.isLoading = false;
        // Optionally, you can refresh the property data or show a success message
        this.property = { ...this.property, ...field };
      },
      error: (error) => {
        console.error('Error updating property:', error);
        // Handle error, e.g., show a notification or alert
        this.isLoading = false;
      }
    });
  }

  setEditingField(field: 'name' | 'location' | 'address' | 'description' | 'property_type' | 'property_features' | 'property_images', editing: boolean): void {
    console.log(`Editing ${field}:`, editing);
    // Update the corresponding editing property
    switch (field) {
      case 'name':
        this.editingName = editing;
        break;
      case 'location':
        this.editingLocation = editing;
        break;
      case 'address':
        this.editingAddress = editing;
        break;
      case 'description':
        this.editingDescription = editing;
        break;
      case 'property_type':
        this.editingCategory = editing;
        break;
      case 'property_features':
        this.editingAmenities = editing;
        break;
    }
    const updatedValue = this.editForm.get(field)?.value;
    console.log(`Current property ${field}:`, this.property?.[field]);
    console.log('Form control value:', updatedValue);
    const isValueChanged = updatedValue !== this.property?.[field];
    if (!editing && isValueChanged && updatedValue !== undefined) {
      this.updateField({ [field]: updatedValue });
    }
  }

  removeImage(imageUrl: string): void {
    this.updatePropertyImages(imageUrl);
    return console.log('Removing image:', imageUrl);
    this.propertyService.deleteImage(this.property!.id, imageUrl).subscribe({
      next: (response) => {
        console.log('Image removed successfully:', response);
        // Optionally, you can refresh the property images or show a success message
        this.updatePropertyImages(imageUrl);
      },
      error: (error) => {
        console.error('Error removing image:', error);
        // Handle error, e.g., show a notification or alert
      }
    });
  }

  updatePropertyImages(imageUrl: string): void {
    if (this.property && this.property!.property_images) {
      this.property!.property_images = this.property!.property_images.filter(img => img.image_url !== imageUrl);
      // this.updateField({ property_images: this.property!.property_images });
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      this.isLoading = true;
      this.imageService.uploadImage(file).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Image uploaded successfully: ', response);
          this.uploadedImages.push(response.file.secure_url);
          this.getPropertyById(); // Refresh property data to include new image
        },
        error: (error) => {
          this.isLoading = false;
          console.log('Error uploading image: ', error);
        }
      })
    } else {
      console.log('No file selected')
    }
  }

  getPropertyAdminFeatures(): void {
    this.isLoading = true;
    this.propertyService.getPropertyFeatures().subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Property Features:', response);
        this.adminFeatures = response.data || [];
        console.log('Property Features:', this.adminFeatures);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching property features:', error);
      }
    });
  }

  submitFormAmenities(): void {
    if (this.formAmenities.valid) {
      console.log('submit', this.formAmenities.value);
      const data = this.formAmenities.value
      console.log({ data });
      this.updateFeatures(data.features ?? []);
    } else {
      Object.values(this.formAmenities.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  submitUnit(): void {
    if (this.unitForm.valid) {
      console.log('submit', this.unitForm.value);
      const data = this.unitForm.value;
      console.log({ data });
      // Call a method to handle unit submission
      // this.createUnit(data);
    } else {
      Object.values(this.unitForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateFeatures(features: number[]): void {
    this.isLoading = true;
    console.log('Updating features:', {features});
    this.propertyService.updateFeatures(this.property!.id, { features }).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Features updated successfully:', response);
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error updating features:', error);
      }
    });
  }

  getPropertyTypes() {
    this.isLoading = true;
    this.propertyService.getPropertyTypes().subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Property Types:', response);
        this.propertyTypes = response.data || [];
        console.log('Property Types:', this.propertyTypes);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching property types:', error);
      }
    });
  }

  addUnit(): void {
    console.log('Adding unit with data:', this.unitForm.value);
  }
  removeUnit(unit: any): void {
    console.log('Removing unit:', unit);
  }

  removeUnitType(index: number): void {
    if (this.unitTypes.length > 1) {
      this.unitTypes.removeAt(index);
    }
  }

  submitUnits(): void {
    console.log('Submitting units:', this.unitTypeForm.value);
    if (this.unitForm.valid) {
      console.log('submit', this.unitForm.value);
      const data = this.unitForm.value;
      const payload = {
        unit_types: [
          {
            unit_type_id: data.unit_type_id,
            price: data.price,
            total_units: data.total_units
          }
        ]
      };
      console.log('Payload for unit submission:', payload);
      console.log({ data });
      // Call a method to handle unit submission
      // this.createUnit(data);
    } else {
      Object.values(this.unitForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

//   {
//   "unit_types": [
//     {
//       "unit_type_id": 2,
//       "price": 500000,
//       "total_units": 3
//     }
//   ]
// }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}