import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-add-realtor',
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
  ],
  templateUrl: './add-realtor.component.html',
  styleUrl: './add-realtor.component.css',
})
export class AddRealtorComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();

  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.email, Validators.required]),
    password: this.fb.control('', [Validators.required]),
    checkPassword: this.fb.control('', [
      Validators.required,
      this.confirmationValidator,
    ]),
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    realtorTag: this.fb.control('', [Validators.required]),
    nationality: this.fb.control('', [Validators.required]),
    state: this.fb.control('', [Validators.required]),
    residentialAddress: this.fb.control('', [Validators.required]),
    identity: this.fb.control('', [Validators.required]),
    bvn: this.fb.control('', [Validators.required]),
    nin: this.fb.control('', [Validators.required]),
  });

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateForm.controls.checkPassword.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  confirmationValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }
}
