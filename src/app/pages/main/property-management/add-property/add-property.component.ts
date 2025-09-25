import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Property, PropertyFeatureAdmin, PropertyType, PropertyTypeOptions, PropertyUnitRequest, PropertyUnit, InstallmentPlan, InstallmentPlanRequest } from 'src/app/core/models/properties';
import { PropertyService } from 'src/app/core/services/property.service';
import { ImageService } from 'src/app/core/services/image.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { Router } from '@angular/router';
import { NgxCurrencyDirective } from "ngx-currency";

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
    NzDividerModule,
    NzPopconfirmModule,
    NgxCurrencyDirective
  ],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.css'
})

export class AddPropertyComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  currentStep = 0;
  isLoading = false;
  propertyTypeOptions: PropertyTypeOptions[] = [];
  adminFeatures: PropertyFeatureAdmin[] = [];
  propertyTypes: PropertyType[] = [];
  createdProperty: Property | null = null;
  uploadedImages: string[] = [];
  unitTypesOptions: any[] = [];
  unitTypeForm: FormGroup;
  installmentPlanForm: FormGroup;
  installmentPlanOptions: InstallmentPlan[] = [];
  unitSaved = false;

  readonly listOfOption: string[] = ['Tarred Road', '24/7 Electricity', 'Fenced Perimeter'];

  constructor(
    private propertyService: PropertyService,
    private imageService: ImageService,
    private notification: NzNotificationService,
    private router: Router, 
    ) {
      this.unitTypeForm = this.fb.group({
        unit_types: this.fb.array([])
      });
      this.installmentPlanForm = this.fb.group({
        installment_plans: this.fb.array([])
      });
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

  formPaymentPlan = this.fb.group({});

  ngOnInit(): void {
    this.getPropertyTypeOptions();
    this.getPropertyAdminFeatures();
    this.getPropertyTypes();
    this.getUnitTypes();
    this.addUnitType();
    this.getInstallmentPlanOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get unitTypes(): FormArray {
    return this.unitTypeForm.get('unit_types') as FormArray;
  }
  
  get installmentPlans(): FormArray {
    return this.installmentPlanForm.get('installment_plans') as FormArray;
  }

  createUnitType(): FormGroup {
    return this.fb.group({
      unit_type_id: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      total_units: ['', [Validators.min(1)]]
    });
  }

  createInstallmentPlan(): FormGroup {
    console.log('Creating installment plan form group');
    return this.fb.group({
      plan_id: ['', []],
      unit_id: ['', []],
      initial_amount: ['', [Validators.min(0)]],
      total_price: ['', [Validators.min(0)]]
    });
  }

  addUnitType(): void {
    this.unitTypes.push(this.createUnitType());
  }

  addInstallmentPlan(): void {
    console.log('Adding installment plan');
    this.installmentPlans.push(this.createInstallmentPlan());
  }

  trackByUnitType(index: number, unit: AbstractControl): number {
    return index;
  }

  trackByInstallmentPlan(index: number, plan: AbstractControl): number {
    return index;
  }

  trackByPlan(index: number, plan: AbstractControl): number {
    return index;
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
        this.notification.success('Success', 'Property images added successfully');
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

  submitUnits(): void {
      if (this.unitTypeForm.valid) {
        const newUnits = this.unitTypeForm.value.unit_types
          .map((unit: any, index: number) => ({ ...unit, index }))
          .filter((unit: any) => !unit.isSaved);
        if (!newUnits.length) {
          this.notification.info('Info', 'No new units to save.');
          return;
        }
        const data: PropertyUnitRequest = {
          unit_types: newUnits.map((unit: any) => ({
            unit_type_id: unit.unit_type_id,
            price: unit.price,
            total_units: unit.total_units
          }))
        };

        console.log({ data });
        this.createUnits(data);
      } else {
        this.unitTypes.controls.forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        this.notification.warning('Warning', 'Please fill out all required unit fields');
      }
    }

    submitPlans(): void {
      if (this.installmentPlanForm.valid) {
        // const newPlans = this.installmentPlanForm.value.installment_plans
        //   .map((plan: any, index: number) => ({ ...plan, index }))
        //   .filter((plan: any) => !plan.isSaved);
        // if (!newPlans.length) {
        //   this.notification.info('Info', 'No new plans to save.');
        //   return;
        // }
        // const data = newPlans.map((plan: any) => ({
        //     plan_id: plan.plan_id,
        //     unit_id: plan.unit_id,
        //     initial_amount: plan.initial_amount,
        //     total_price: plan.total_price
        // })); 
        const data = this.installmentPlanForm.value;
        console.log({ data });
        this.createInstallmentPlans(data);
      } else {
        this.installmentPlans.controls.forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        this.notification.warning('Warning', 'Please fill out all required plan fields');
      }
    }

  skip(): void {
    this.router.navigate([`/main/property-management/view/${this.createdProperty!.id}`]);
  }

    createUnits(data: PropertyUnitRequest): void {
    this.isLoading = true;
    this.propertyService.addPropertyUnit(this.createdProperty!.id, data).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notification.success('Success', 'Units added successfully');
        // this.router.navigate([`/main/property-management/view/${this.createdProperty!.id}`]);
        // this.createdProperty?.property_units?.push(response.data as PropertyUnit);
        // this.createdProperty?.property_units?.push(...response.data as PropertyUnit[]);
        // if (this.createdProperty) {
        //   this.createdProperty.property_units = response.added as PropertyUnit[];
        // }        
        // Mark all units as saved
        // this.unitTypes.controls.forEach((control) => {
        //   control.patchValue({ isSaved: true });
        // });
        this.unitSaved = true;
        console.log('Units added successfully:', response);
        this.getPropertyById(this.createdProperty!.id);
        // console.log('Created Property after adding units:', this.createdProperty);
        this.unitTypeForm.reset();
        
        this.addInstallmentPlan();
        const element = document.getElementById('plans-section');
        console.log({element});
        if (element) {
          // Use the scrollIntoView() method for smooth scrolling
           element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to add units');
        console.error('Error adding units:', error);
      }
    });
  }

  createInstallmentPlans(data: InstallmentPlanRequest): void {
    console.log({ data });
    this.isLoading = true;
    this.propertyService.addPropertyInstallmentPlans(this.createdProperty!.id, data).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notification.success('Success', 'Installment plans added successfully');
        console.log('Installment plans added successfully:', response);
        this.router.navigate([`/main/property-management/view/${this.createdProperty!.id}`]);
        // Mark all plans as saved
        // this.installmentPlans.controls.forEach((control) => {
        //   control.patchValue({ isSaved: true });
        // });
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to add installment plans');
        console.error('Error adding installment plans:', error);
      }
    });
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
          this.notification.success('Success', 'Property initial details created successfully');
          this.createdProperty = response.data!;
          this.currentStep = 1; 
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
          this.notification.success('Success', 'Property features added successfully');
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
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB in bytes
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    // maximum number of images is 10
    if (this.uploadedImages.length >= 10) {
      this.notification.error('Error', 'You can only upload a maximum of 10 images');
      input.value = ''; // Clear the input
      return;
    }

    if (file) {
      if (file.size > maxSizeInBytes) {
        this.notification.error('Error', 'Image must be 1MB or smaller');
        input.value = ''; // Clear the input
        return;
      }
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        this.notification.error('Error', 'Only JPEG and PNG images are allowed');
        input.value = ''; // Clear the input
        return;
      }
      this.isLoading = true;
      this.imageService.uploadImage(file).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.uploadedImages.push(response.data.file.secure_url);
        },
        error: (error) => {
          this.isLoading = false;
          this.notification.error('Error', 'Failed to upload image');
          console.error('Error uploading image:', error);
        }
      });
    }
  }

  removeUnitType(index: number): void {
    if (this.unitTypes.length > 1) {
      this.unitTypes.removeAt(index);
    }
  }

  removeInstallmentPlan(index: number): void {
    if (this.installmentPlans.length > 1) {
      this.installmentPlans.removeAt(index);
    }
  }

  removeImage(imageUrl: string): void {
    console.log('Images before removal:', this.uploadedImages);
    this.uploadedImages = this.uploadedImages.filter(x => x !== imageUrl);
    console.log('Images after removal:', this.uploadedImages);
  }

  getInstallmentPlanOptions(): void {
    this.isLoading = true;
    this.propertyService.getInstallmentPlans().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.installmentPlanOptions = response.data || [];
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to fetch installment plans');
        console.error('Error fetching installment plans:', error);
      }
    });
  }

  getPropertyById(id: string): void {
    this.isLoading = true;
    this.propertyService.getPropertyById(id).subscribe({
      next: (property) => {
        this.createdProperty = property;
        this.isLoading = false;
        // this.editForm.patchValue({
        //   property_type: property?.type_id || '',
        //   name: property?.name || '',
        //   location: property?.location || '',
        //   address: property?.address || '',
        //   description: property?.description || '',
        //   property_features: property?.property_features || []
        // });
        // this.currentFeatures = property.property_features.map(x => x.feature_id);
        // this.uploadedImages = [...new Set(property.property_images.map(x => x.image_url))];
        
        // while (this.unitTypes.length) {
        //   this.unitTypes.removeAt(0);
        // }
        // if (property?.property_units?.length) {
        //   property.property_units.forEach(unit => {
        //     this.unitTypes.push(this.createUnitType(unit));
        //   });
        // } else {
        //   this.addUnitType();
        // }
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to fetch property data');
        console.error('Error fetching property:', error);
      }
    });
  }

  deleteInstallmentPlan(unitIndex: number, planIndex: number): void {
    this.isLoading = true;
    const unitId = this.createdProperty?.property_units[unitIndex]?.id;
    if (!unitId) {
      this.notification.error('Error', 'Unit ID is missing');
      this.isLoading = false;
      return;
    }
    const planId = this.createdProperty?.property_units[unitIndex]?.property_installment_plans[planIndex]?.id;
    if (!planId) {
      this.notification.error('Error', 'Installment Plan ID is missing');
      this.isLoading = false;
      return;
    }
    console.log('Deleting installment plan with IDs:', {unitIndex, unitId, planId});
    this.propertyService.deleteInstallmentPlanFromUnit(this.createdProperty!.id, planId!).subscribe({
      next: () => {
        this.isLoading = false;
        // const plans = this.getInstallmentPlans(unitIndex);
        // plans.removeAt(planIndex);
        // this.getPropertyById(this.createdProperty!.id);
        this.notification.success('Success', 'Installment plan removed successfully');
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to remove installment plan');
        console.error('Error deleting installment plan:', error);
      }
    });
  }
}
