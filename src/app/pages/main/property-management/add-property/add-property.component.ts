import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { PropertyFeatureAdmin, PropertyTypeOptions } from 'src/app/core/models/properties';
import { PropertyService } from 'src/app/core/services/property.service';

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
  currentStep = 1;
  isLoading = false;
  propertyTypeOptions: PropertyTypeOptions[] = [];
  adminFeatures: PropertyFeatureAdmin[] = [];

  // alphabet(): string[] {
  // const children: string[] = [];
  // for (let i = 10; i < 36; i++) {
  //   children.push(i.toString(36) + i);
  // }
  // return children;
  // }

  readonly listOfOption: string[] = ['Tarred Road', '24/7 Electricity', 'Fenced Perimeter'];

  constructor(private propertyService: PropertyService) {
  }

  formBasic = this.fb.group({
    property_type: this.fb.control('', [Validators.required]),
    name: this.fb.control('', [Validators.required]),
    location: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required])
  });

  formAmenities = this.fb.group({
    amenities: this.fb.control<PropertyFeatureAdmin[]>([], [Validators.required])
  });

  formImages = this.fb.group({
    images: this.fb.control([], [Validators.required])
  });

  formPaymentPlan = this.fb.group({});

  ngOnInit(): void {
    this.getPropertyTypeOptions();
    this.getPropertyAdminFeatures();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    console.log(file, fileList);
  }

  submitFormBasic(): void {
    if (this.formBasic.valid) {
      console.log('submit', this.formBasic.value);
      this.currentStep = 1;
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
      this.currentStep = 2
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
    this.currentStep = 3
  }

  submit(): void {
    console.log('final submit');
    this.currentStep = 0;
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

  getPropertyAdminFeatures(): void {
    this.isLoading = true;
    this.propertyService.getPropertytypesOptions2().subscribe({
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

  handleSelectedFeatures(selected: PropertyFeatureAdmin[]) {
    this.formAmenities.patchValue({ amenities: selected });
    console.log('Selected Features:', selected);
  }
}
  