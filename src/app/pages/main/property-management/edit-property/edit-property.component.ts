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
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { PropertyService } from 'src/app/core/services/property.service';
import { InstallmentPlan, InstallmentPlanRequest, Property, PropertyFeatureAdmin, PropertyType, PropertyTypeOptions, PropertyUnitRequest } from 'src/app/core/models/properties';
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
    NzDatePickerModule,
    NzPopconfirmModule
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

  get unitTypes(): FormArray {
    return this.unitTypeForm.get('unit_types') as FormArray;
  }

  getInstallmentPlans(unitIndex: number): FormArray {
    return this.unitTypes.at(unitIndex).get('installment_plans') as FormArray;
  }

  createUnitType(unit?: any): FormGroup {
    const formGroup = this.fb.group({
      unit_type_id: [unit?.unit_type_id || '', [Validators.required]],
      price: [unit?.price || '', [Validators.required, Validators.min(0)]],
      total_units: [unit?.total_units || '', [Validators.required, Validators.min(1)]],
      installment_plans: this.fb.array(unit?.property_installment_plans?.map((plan: any) => this.createInstallmentPlan(plan)) || []),
      isSaved: [!!unit]
    });
    if (unit) {
      formGroup.disable();
    }
    return formGroup;
  }

  createInstallmentPlan(plan?: any): FormGroup {
    const formGroup = this.fb.group({
      plan_id: [plan?.plan_id, [Validators.required]],
      initial_amount: [plan?.initial_amount || '', [Validators.required, Validators.min(0)]],
      total_price: [plan?.total_price || '', [Validators.required, Validators.min(0)]],
      start_date: [plan?.start_date ? new Date(plan.start_date) : '', [Validators.required]],
      isSaved: [!!plan]
    });
    if (plan) {
      formGroup.disable();
    }
    return formGroup;
  }

  addUnitType(): void {
    this.unitTypes.push(this.createUnitType());
  }

  addInstallmentPlan(unitIndex: number): void {
    const unit = this.unitTypes.at(unitIndex);
    if (!unit.get('isSaved')?.value) {
      this.notification.warning('Warning', 'Please save the unit before adding installment plans.');
      return;
    }
    const plans = this.getInstallmentPlans(unitIndex);
    plans.push(this.createInstallmentPlan());
  }

  removeInstallmentPlan(unitIndex: number, planIndex: number): void {
    const plans = this.getInstallmentPlans(unitIndex);
    const planId = plans.at(planIndex).get('plan_id')?.value;
    if (planId && this.property?.property_units[unitIndex]?.property_installment_plans?.find(p => p.plan_id === planId)) {
      this.deleteInstallmentPlan(unitIndex, planIndex);
    } else {
      plans.removeAt(planIndex);
    }
  }

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
        this.editForm.patchValue({
          property_type: property?.property_type.name || '',
          name: property?.name || '',
          location: property?.location || '',
          address: property?.address || '',
          description: property?.description || '',
          property_features: property?.property_features || []
        });
        this.currentFeatures = property.property_features.map(x => x.feature_id);
        this.uploadedImages = [...new Set(property.property_images.map(x => x.image_url))];
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
        this.notification.success('Success', 'Units added successfully');
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to add units');
        console.error('Error adding units:', error);
      }
    });
  }

  submitInstallmentPlans(unitIndex: number): void {
    const unit = this.unitTypes.at(unitIndex);
    if (unit.valid) {
      const unitId = this.property?.property_units[unitIndex]?.id;
      if (!unitId) {
        this.notification.error('Error', 'Unit ID is missing. Please save the unit first.');
        return;
      }
      const plansArray = this.getInstallmentPlans(unitIndex);
      const newPlans = plansArray.controls
        .filter(control => !control.get('isSaved')?.value)
        .map((control) => ({
          plan_id: control.value.plan_id,
          unit_id: unitId,
          initial_amount: parseFloat(control.value.initial_amount),
          total_price: parseFloat(control.value.total_price),
          start_date: control.value.start_date.toISOString()
        }));
      if (!newPlans.length) {
        this.notification.info('Info', 'No new installment plans to save.');
        return;
      }
      const data: InstallmentPlanRequest = { installment_plans: newPlans };
      return console.log('Creating installment plans with data:', {unitIndex, unitId, data}),
      this.createInstallmentPlans(unitId, data);
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
    this.propertyService.addPropertyInstallmentPlans(this.property!.id, data).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.notification.success('Success', 'Installment plans added successfully');
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to add installment plans');
        console.error('Error adding installment plans:', error);
      }
    });
  }

  deleteInstallmentPlan(unitIndex: number, planIndex: number): void {
    this.isLoading = true;
    const unitId = this.property?.property_units[unitIndex]?.id;
    if (!unitId) {
      this.notification.error('Error', 'Unit ID is missing');
      this.isLoading = false;
      return;
    }
    const planId = this.property?.property_units[unitIndex]?.property_installment_plans[planIndex]?.id;
    if (!planId) {
      this.notification.error('Error', 'Installment Plan ID is missing');
      this.isLoading = false;
      return;
    }
    console.log('Deleting installment plan with IDs:', {unitIndex, unitId, planId});
    this.propertyService.deleteInstallmentPlanFromUnit(this.property!.id, planId!).subscribe({
      next: () => {
        this.isLoading = false;
        const plans = this.getInstallmentPlans(unitIndex);
        plans.removeAt(planIndex);
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
    if (this.unitTypes.length > 1) {
      const unitId = this.property?.property_units[index]?.id;
      if (unitId) {
        this.deleteUnitType(index, unitId);
      } else {
        this.unitTypes.removeAt(index);
      }
    }
  }

  deleteUnitType(index: number, unitId: number): void {
    this.isLoading = true;
    this.propertyService.deletePropertyUnit(this.property!.id, unitId).subscribe({
      next: () => {
        this.isLoading = false;
        this.unitTypes.removeAt(index);
        this.notification.success('Success', 'Unit removed successfully');
        this.getPropertyById();
      },
      error: (error) => {
        this.isLoading = false;
        this.notification.error('Error', 'Failed to remove unit');
        console.error('Error deleting unit:', error);
      }
    });
  }

  submit(): void {
    if (this.editForm.valid) {
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