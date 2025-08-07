import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';

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
import { Property } from 'src/app/core/models/properties';

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
editingDescription = false;
editForm: FormGroup;
// Define the keys that are allowed to be updated

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
    private propertyService: PropertyService
  ) {
      this.editForm = this.fb.group({
      category: this.fb.control(this.property?.property_type.name, [Validators.required]),
      name: this.fb.control(this.property?.name, [Validators.required]),
      location: this.fb.control(this.property?.location, [Validators.required]),
      description: this.fb.control(this.property?.description, [Validators.required]),
      amenities: this.fb.control(this.property?.property_features, [Validators.required]),
      images: this.fb.control(this.property?.property_images, [Validators.required])
    });
  }



  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.propertyService.getPropertyById(this.id!).subscribe(property => {
        this.property = property;
        console.log('Fetched property:', this.property);
          this.editForm = this.fb.group({
            category: this.fb.control(this.property?.property_type.name, [Validators.required]),
            name: this.fb.control(this.property?.name, [Validators.required]),
            location: this.fb.control(this.property?.location, [Validators.required]),
            description: this.fb.control(this.property?.description, [Validators.required]),
            amenities: this.fb.control(this.property?.property_features, [Validators.required]),
            images: this.fb.control(this.property?.property_images, [Validators.required])
          });
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

  setEditingName(editing: boolean): void {
    console.log('Editing name:', editing);
    this.editingName = editing;
    const updatedValue = this.editForm.get('name')?.value;
    console.log('Current property name:', this.property?.name);
    console.log('Form control value:', updatedValue);
    const isValueChanged: boolean = updatedValue !== this.property?.name;
    if (!this.editingName && isValueChanged) {
      this.updateField({name: updatedValue});
    }
  }

  setEditingLocation(editing: boolean): void {
    console.log('Editing location:', editing);
    this.editingLocation = editing;
  }

  setEditingDescription(editing: boolean): void {
    console.log('Editing description:', editing);
    this.editingDescription = editing;
  }


  updateField(field: any): void {
    this.propertyService.updateProperty(this.property!.id, field).subscribe({
      next: (response) => {
        console.log('Property updated successfully:', response);
        // Optionally, you can refresh the property data or show a success message
        this.property = { ...this.property, ...field };
      },
      error: (error) => {
        console.error('Error updating property:', error);
        // Handle error, e.g., show a notification or alert
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}