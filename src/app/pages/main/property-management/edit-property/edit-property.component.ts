import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Properties } from 'src/app/core/constants';
import { Property } from 'src/app/core/types/general';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDividerModule } from 'ng-zorro-antd/divider';

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
properties: Property[] = Properties;
property: Property | null = null;
private fb = inject(NonNullableFormBuilder);
private destroy$ = new Subject<void>();

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

  constructor(private route: ActivatedRoute) {}

  editForm = this.fb.group({
    category: this.fb.control('', [Validators.required]),
    name: this.fb.control('', [Validators.required]),
    location: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    amenities: this.fb.control([], [Validators.required]),
    images: this.fb.control([], [Validators.required])
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      console.log('Route ID:', this.id); // For debugging
      this.property = this.properties.find(p => p.id === Number(this.id)) || null;
      console.log({property: this.property})
      if (!this.property) {
        console.warn('Property not found for ID:', this.id);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}