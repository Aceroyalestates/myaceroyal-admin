import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Subject, takeUntil } from 'rxjs';
import { Role } from 'src/app/core/models/generic';
import { AdminService } from 'src/app/core/services/admin.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-add-admin',
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzAlertModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
  ],
  templateUrl: './add-admin.component.html',
  styleUrl: './add-admin.component.css',
})
export class AddAdminComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  roles: Role[] = [];
  isLoading = false;
  error: string | null = null;
  showPassword = false;
  showConfirmPassword = false;

  confirmationValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = this.form?.controls.password.value;
    if (!control.value) {
      return { required: true };
    }
    if (control.value !== password) {
      return { confirm: true, error: true };
    }
    return null;
  };
  constructor(private adminService: AdminService) {}

  form = this.fb.group({
    email: this.fb.control('', [Validators.email, Validators.required]),
    password: this.fb.control('', [Validators.required]),
    checkPassword: this.fb.control('', [
      Validators.required,
      this.confirmationValidator.bind(this),
    ]),
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    phone: this.fb.control('', [Validators.required]),
    role: this.fb.control('', [Validators.required]),
  });

  get passwordStrength(): 'weak' | 'medium' | 'strong' | 'empty' {
    const val = this.form.controls.password.value || '';
    if (!val) return 'empty';
    // simple heuristic: length + character variety
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNum = /\d/.test(val);
    const hasSym = /[^A-Za-z0-9]/.test(val);
    const score = [hasUpper, hasLower, hasNum, hasSym].filter(Boolean).length + (val.length >= 10 ? 1 : 0);
    if (score >= 4) return 'strong';
    if (score >= 3) return 'medium';
    return 'weak';
  }

  ngOnInit(): void {
    this.form.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.controls.checkPassword.updateValueAndValidity();
      });

      this.adminService.getRoles().pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.roles = response.data;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    this.isLoading = true;
    this.error = null;
    if (this.form.valid) {
      const { email, password, firstName, lastName, phone, role } = this.form
        .value as Record<string, string>;
      this.adminService
        .addAdmin({
          email,
          password,
          full_name: firstName +" "+ lastName,
          phone,
          role_id: parseInt(role),
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            this.error = null;
            console.log('Admin added successfully:', response);
            this.form.reset();
          },
          error: (error) => {
            console.error('Error adding admin:', error);
            // Handle error appropriately, e.g., show a notification
          },
        });
      console.log('submit', this.form.value);
    } else {
      console.log('Form is invalid');
      this.isLoading = false;
      this.error = 'Please fill in all required fields correctly.';
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
