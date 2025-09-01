import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { PropertyService } from 'src/app/core/services/property.service';
import { InstallmentPlan, InstallmentPlanCreate, InstallmentPlanRequest, Property, PropertyFeatureAdmin, PropertyType, PropertyTypeOptions, PropertyUnitRequest } from 'src/app/core/models/properties';
import { ImageService } from 'src/app/core/services/image.service';



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
    NzCollapseModule,
    NzDatePickerModule
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
  unitTypesOptions: any[] = [];
  installmentPlans: InstallmentPlan[] = [];

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private imageService: ImageService,
    private notification: NzNotificationService
  ) {
    this.editForm = this.fb.group({
      property_type: ['', [Validators.required]],
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      address: ['', [Validators.required]],
      description: ['', [Validators.required]],
      property_features: [[], [Validators.required]],
      images: [[], [Validators.required]]
    });

    this.unitTypeForm = this.fb.group({
      unit_types: this.fb.array([])
    });
  }

  formAmenities = this.fb.group({
    features: this.fb.control<number[]>(this.currentFeatures, [Validators.required])
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.getPropertyById();
      this.getPropertyTypeOptions();
      this.getPropertyAdminFeatures();
      this.getPropertyTypes();
      this.getUnitTypes();
      this.getInstallmentPlanOptions();
    } else {
      this.notification.error('Error', 'Property ID is not provided in the route.');
      console.error('Property ID is not provided in the route.');
    }
  }

  // Getter for the unit_types FormArray
  get unitTypes(): FormArray {
    return this.unitTypeForm.get('unit_types') as FormArray;
  }

  getInstallmentPlans(unitIndex: number): FormArray {
    return this.unitTypes.at(unitIndex).get('installment_plans') as FormArray;
  }

  // Create a new unit type form group
  createUnitType(unit?: any): FormGroup {
    return this.fb.group({
      unit_type_id: [unit?.unit_type_id || '', [Validators.required]],
      price: [unit?.price || '', [Validators.required, Validators.min(0)]],
      total_units: [unit?.total_units || '', [Validators.required, Validators.min(1)]],
      installment_plans: this.fb.array(unit?.property_installment_plans?.map((plan: any) => this.createInstallmentPlan(plan)) || [])
    });
  }

  // Create a new installment plan form group
  createInstallmentPlan(plan?: any): FormGroup {
    return this.fb.group({
      plan_id: [plan?.plan_id, [Validators.required]],
      initial_amount: [plan?.initial_amount || '', [Validators.required, Validators.min(0)]],
      total_price: [plan?.total_price || '', [Validators.required, Validators.min(0)]],
      start_date: [plan?.start_date ? new Date(plan.start_date) : '', [Validators.required]]
    });
  }

  // Add a new unit type to the FormArray
  addUnitType(): void {
    this.unitTypes.push(this.createUnitType());
  }

  // Add a new installment plan to a specific unit
  addInstallmentPlan(unitIndex: number): void {
    const plans = this.getInstallmentPlans(unitIndex);
    plans.push(this.createInstallmentPlan());
  }

  // Remove an installment plan from a specific unit
  removeInstallmentPlan(unitIndex: number, planIndex: number): void {
    console.log({ unitIndex, planIndex });
    const plans = this.getInstallmentPlans(unitIndex);
    const planId = plans.at(planIndex).get('plan_id')?.value;
    if (planId && this.property?.property_units[unitIndex]?.property_installment_plans[planIndex]?.plan_id) {
      this.deleteInstallmentPlan(unitIndex);
    } else {
      // plans.removeAt(planIndex);
    }
  }

  // TrackBy functions
  trackByUnitType(index: number, unit: AbstractControl): number {
    return index;
  }

  trackByPlan(index: number, plan: AbstractControl): number {
    return index;
  }

  getPropertyById(): void {
    this.isLoading = true;
    this.propertyService.getPropertyById(this.id!).subscribe({
      next: (property) => {
        this.property = property;
        this.isLoading = false;

        // Update editForm
        this.editForm.patchValue({
          property_type: property?.property_type.name || '',
          name: property?.name || '',
          location: property?.location || '',
          address: property?.address || '',
          description: property?.description || '',
          property_features: property?.property_features || [],
          // images: property?.property_images.map(x => x.image_url) || []
        });

        // Update currentFeatures and uploadedImages
        this.currentFeatures = property.property_features.map(x => x.feature_id);
        this.uploadedImages = [...new Set(property.property_images.map(x => x.image_url))];

        // Populate unit_types FormArray
        while (this.unitTypes.length) {
          this.unitTypes.removeAt(0);
        }
        if (property?.property_units?.length) {
          property.property_units.forEach(unit => {
            this.unitTypes.push(this.createUnitType(unit));
          });
        } else {
          this.addUnitType();
        }

        console.log({ uploadedImages: this.uploadedImages, unitTypes: this.unitTypes.value });
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to fetch property data');
        console.error('Error fetching property:', error);
      }
    });
  }

  getPropertyTypeOptions(): void {
    this.isLoading = true;
    this.propertyService.getPropertytypesOptions().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.propertyTypeOptions = response.data || [];
        console.log('Property Type Options:', this.propertyTypeOptions);
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to fetch property type options');
        console.error('Error fetching property type options:', error);
      }
    });
  }

  getUnitTypes(): void {
    this.isLoading = true;
    this.propertyService.getUnitTypes().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.unitTypesOptions = response.data || [];
        console.log('Unit Types:', this.unitTypesOptions);
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to fetch unit types');
        console.error('Error fetching unit types:', error);
      }
    });
  }

  submitUnits(): void {
    if (this.unitTypeForm.valid) {
      const data: PropertyUnitRequest = {
        unit_types: this.unitTypeForm.value.unit_types.map((unit: any) => ({
          unit_type_id: unit.unit_type_id,
          price: unit.price,
          total_units: unit.total_units
        }))
      };
      console.log('Submitting units:', data);
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

  createUnits(data: PropertyUnitRequest): void {
    this.isLoading = true;
    this.propertyService.addPropertyUnit(this.property!.id, data).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notification.success('Success', 'Units updated successfully');
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to update units');
        console.error('Error updating units:', error);
      }
    });
  }

  submitInstallmentPlans(unitIndex: number): void {
    console.log({ unitIndex });
    const unit = this.unitTypes.at(unitIndex);
    console.log('Submitting installment plans for unit index:', unitIndex, unit.value);
    if (unit.valid) {
      const unitId = this.property?.property_units[unitIndex]?.id;
      if (!unitId) {
        this.notification.error('Error', 'Unit ID is missing. Please save the unit first.');
        return;
      }
      const plansArray = this.getInstallmentPlans(unitIndex);
      const allPlans = plansArray.value.map((plan: any) => ({
        plan_id: plan.plan_id,
        unit_id: unitId,
        initial_amount: parseFloat(plan.initial_amount),
        total_price: parseFloat(plan.total_price),
        start_date: plan.start_date.toISOString()
      }));
      
      const newPlans = plansArray.controls
        .filter(control => control.dirty || control.touched)
        .map((control, index) => ({
          plan_id: control.value.plan_id,
          unit_id: unitId,
          initial_amount: parseFloat(control.value.initial_amount),
          total_price: parseFloat(control.value.total_price),
          start_date: control.value.start_date.toISOString()
        }));
      
      const data: InstallmentPlanRequest = {
        installment_plans: allPlans
      };
      
      console.log('All installment plans:', { installment_plans: allPlans });
      console.log('Newly added installment plans:', { installment_plans: newPlans });
      this.createInstallmentPlans(unitId, { installment_plans: newPlans });
    } else {
      const plansArray = this.getInstallmentPlans(unitIndex);
      plansArray.controls.forEach((control: AbstractControl) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.notification.warning('Warning', 'Please fill out all required plan fields');
    }
}

  createInstallmentPlans(unitId: number, data: InstallmentPlanRequest): void {
    this.isLoading = true;
    console.log('Creating installment plans for unitId:', unitId, data);
    this.propertyService.addPropertyInstallmentPlans(this.property!.id, data).subscribe({
      next: (response) => {
        console.log('Installment plans created successfully:', response);
        this.isLoading = false;
        this.notification.success('Success', 'Installment plans updated successfully');
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to update installment plans');
        console.error('Error updating installment plans:', error);
      }
    });
  }

  deleteInstallmentPlan(unitIndex: number): void {
    this.isLoading = true;
    const unitId = this.property?.property_units[unitIndex]?.id;
    if (!unitId) {
      this.notification.error('Error', 'Unit ID is missing');
      this.isLoading = false;
      return;
    }
    this.propertyService.deleteInstallmentPlanFromUnit(this.property!.id, unitId).subscribe({
      next: () => {
        this.isLoading = false;
        // const plans = this.getInstallmentPlans(unitIndex);
        // plans.removeAt(planIndex);
        this.notification.success('Success', 'Installment plan removed successfully');
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to remove installment plan');
        console.error('Error deleting installment plan:', error);
      }
    });
  }

  removeUnitType(index: number): void {
    console.log({ index });
    if (this.unitTypes.length > 1) {
      const unitId = this.property?.property_units[index]?.id;
      console.log({ unitId });
      if (unitId) {
        // this.deleteUnitType(index, unitId);
      } else {
        this.unitTypes.removeAt(index);
      }
    }
  }

  deleteUnitType(index: number, unitId: number): void {
    this.isLoading = true;
    // this.propertyService.deletePropertyUnit(this.property!.id, unitId).subscribe({
    //   next: () => {
    //     this.isLoading = false;
    //     this.unitTypes.removeAt(index);
    //     this.notification.success('Success', 'Unit removed successfully');
    //     this.getPropertyById();
    //   },
    //   error: (error) => {
    //     this.isLoading = false;
    //     this.notification.error('Error', 'Failed to remove unit');
    //     console.error('Error deleting unit:', error);
    //   }
    // });
  }

  submit(): void {
    if (this.editForm.valid) {
      console.log('submit', this.editForm.value);
      this.updateField(this.editForm.value);
    } else {
      Object.values(this.editForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.notification.warning('Warning', 'Please fill out all required property fields');
    }
  }

  updateField(field: any): void {
    this.isLoading = true;
    this.propertyService.updateProperty(this.property!.id, field).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notification.success('Success', 'Property updated successfully');
        this.property = { ...this.property, ...field };
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to update property');
        console.error('Error updating property:', error);
      }
    });
  }

  setEditingField(field: 'name' | 'location' | 'address' | 'description' | 'property_type' | 'property_features', editing: boolean): void {
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
      // case 'images':
      //   this.editingImages = editing;
      //   break;
    }
    if (!editing) {
      const updatedValue = this.editForm.get(field)?.value;
      const isValueChanged = updatedValue !== this.property?.[field];
      if (isValueChanged && updatedValue !== undefined) {
        this.updateField({ [field]: updatedValue });
      }
    }
  }

  removeImage(imageId: number): void {
    this.isLoading = true;
    this.removeImageFromProperty(imageId);
  }

  removeImageFromProperty(imageId: number): void {
    this.propertyService.deleteImage(this.property!.id, imageId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notification.success('Success', 'Image removed successfully');
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to remove image');
        console.error('Error removing image:', error);
      }
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.isLoading = true;
      this.imageService.uploadImage(file).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.addPropertyImages([...this.uploadedImages, response.data.file.secure_url]);
        },
        error: (error) => {
          this.isLoading = false;
          this.notification.error('Error', 'Failed to upload image');
          console.error('Error uploading image:', error);
        }
      });
    }
  }

  addPropertyImages(images: string[]): void {
    this.isLoading = true;
    this.propertyService.addImagesToProperty(this.property!.id, { images }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.uploadedImages = images;
        this.editForm.patchValue({ images });
        this.notification.success('Success', 'Images added successfully');
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to add images');
        console.error('Error adding images:', error);
      }
    });
  }

  getPropertyAdminFeatures(): void {
    this.isLoading = true;
    this.propertyService.getPropertyFeatures().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.adminFeatures = response.data || [];
        console.log('Property Features:', this.adminFeatures);
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to fetch property features');
        console.error('Error fetching property features:', error);
      }
    });
  }

  submitFormAmenities(): void {
    if (this.formAmenities.valid) {
      const data = this.formAmenities.value;
      this.updateFeatures(data.features ?? []);
    } else {
      Object.values(this.formAmenities.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.notification.warning('Warning', 'Please select at least one feature');
    }
  }

  updateFeatures(features: number[]): void {
    this.isLoading = true;
    this.propertyService.updateFeatures(this.property!.id, { features }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notification.success('Success', 'Features updated successfully');
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to update features');
        console.error('Error updating features:', error);
      }
    });
  }

  getPropertyTypes(): void {
    this.isLoading = true;
    this.propertyService.getPropertyTypes().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.propertyTypes = response.data || [];
        console.log('Property Types:', this.propertyTypes);
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to fetch property types');
        console.error('Error fetching property types:', error);
      }
    });
  }

  getInstallmentPlanOptions(): void {
    this.isLoading = true;
    this.propertyService.getInstallmentPlans().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.installmentPlans = response.data || [];
        console.log('Installment Plans:', response.data);
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to fetch installment plans');
        console.error('Error fetching installment plans:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}