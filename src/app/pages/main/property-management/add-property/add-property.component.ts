import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject } from 'rxjs';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Property, PropertyFeatureAdmin, PropertyType, PropertyTypeOptions } from 'src/app/core/models/properties';
import { PropertyService } from 'src/app/core/services/property.service';
import { ImageService } from 'src/app/core/services/image.service';

@Component({
  selector: 'app-add-property',
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
    NzDividerModule
  ],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css'
})

export class AddPropertyComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  currentStep = 3;
  isLoading = false;
  propertyTypeOptions: PropertyTypeOptions[] = [];
  adminFeatures: PropertyFeatureAdmin[] = [];
  propertyTypes: PropertyType[] = [];
  createdProperty: Property | null = null;
  uploadedImages: string[] = [];
  unitTypesOptions: any[] = []; 

  readonly listOfOption: string[] = ['Tarred Road', '24/7 Electricity', 'Fenced Perimeter'];

  constructor(private propertyService: PropertyService, private imageService: ImageService) {
  }

  formBasic = this.fb.group({
    type_id: this.fb.control(0, [Validators.required]),
    name: this.fb.control('', [Validators.required]),
    location: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required])
  });

  formAmenities = this.fb.group({
    features: this.fb.control<number[]>([], [Validators.required])
  });

  formImages = this.fb.group({
    images: this.fb.control<any[]>([], [Validators.required])
  });

  unitTypeForm = this.fb.group({
    unit_types: this.fb.array([])
  });

  formPaymentPlan = this.fb.group({});

  ngOnInit(): void {
    this.getPropertyTypeOptions();
    this.getPropertyAdminFeatures();
    this.getPropertyTypes();
    this.getUnitTypes();
    this.addUnitType();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get unitTypes(): FormArray {
    return this.unitTypeForm.get('unit_types') as FormArray;
  }

  createUnitType(): FormGroup {
    return this.fb.group({
      unit_type_id: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      total_units: ['', [Validators.required, Validators.min(1)]]
    });
  }

  addUnitType(): void {
    this.unitTypes.push(this.createUnitType());
  }

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    console.log(file, fileList);
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.imageService.uploadImage(file.response.data).subscribe({
        next: (response) => {
          console.log('Image uploaded successfully:', response);
          this.uploadedImages.push(response.data.file.secure_url)
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        }
      });
    }
  }

  submitFormBasic(): void {
    console.log('submit basic form', this.formBasic);
    if (this.formBasic.valid) {
      console.log('submit', this.formBasic.value);
      this.createProperty();
    } else {
      Object.values(this.formBasic.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
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

  submitImage(): void {
    console.log('submit image');
    const data = {
      images: this.uploadedImages
    }
    console.log({ data });
    this.isLoading = true;
    this.propertyService.addImagesToProperty(this.createdProperty!.id, data).subscribe({
      next: (response) => {
        console.log('Images added successfully:', response);
        this.currentStep = 3; 
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error adding images:', error);
      }
    });
  }

  submit(): void {
    console.log('final submit');
    this.currentStep = 0;
  }

  getPropertyTypeOptions(): void {
    this.isLoading = true;
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

  submitUnit(): void {
    console.log('submit unit types', this.unitTypeForm);
  }

  getUnitTypes() {
    this.isLoading = true;
    this.propertyService.getUnitTypes().subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Unit Types:', response);
        this.unitTypesOptions = response.data || [];
        console.log('Unit Types:', this.unitTypesOptions);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching unit types:', error);
      }
    });
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

  createProperty() {
    if (this.formBasic.valid) {
      this.isLoading = true;
      const propertyData = this.formBasic.value;
      this.propertyService.createProperty(propertyData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Property created successfully:', response);
          this.createdProperty = response.data!;
          this.currentStep = 1; // Move to the next step
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating property:', error);
        }
      });
    } else {
      Object.values(this.formBasic.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateFeatures(features: number[]): void {
    if (this.createdProperty) {
      this.isLoading = true;
      console.log('Updating features:', {features});
      this.propertyService.updateFeatures(this.createdProperty.id, { features }).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Features updated successfully:', response);
          this.currentStep = 2;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating features:', error);
        }
      });
    }
  }

  updateProperty(property: any): void {
    console.log('Updating property:', property);
    if (this.createdProperty) {
      this.isLoading = true;
      this.propertyService.updateProperty(this.createdProperty.id, property).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Property updated successfully:', response);
          this.createdProperty = { ...this.createdProperty, ...response?.data } as Property;
          this.currentStep = 2;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating property:', error);
        }
      });
    } else {
      console.warn('No property created to update');
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
          this.uploadedImages.push(response.data.file.secure_url);
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

  removeImage(imageUrl: string): void {
    console.log('Images before removal:', this.uploadedImages);
    this.uploadedImages = this.uploadedImages.filter(x => x !== imageUrl);
    console.log('Images after removal:', this.uploadedImages);
  }
}
