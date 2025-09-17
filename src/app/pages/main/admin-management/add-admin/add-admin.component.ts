import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ImageService } from 'src/app/core/services/image.service';
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private imageService = inject(ImageService);
  roles: Role[] = [];
  isLoading = false;
  error: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  isEditMode = false;
  adminId: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploadingImage = false;

  confirmationValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = this.form?.controls.password.value;
    
    // In edit mode, if password is empty, confirm password can also be empty
    if (this.isEditMode && !password && !control.value) {
      return null;
    }
    
    // In create mode or if password is provided in edit mode, confirm password is required
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
    password: this.fb.control('', []), // Will be set to required in create mode
    checkPassword: this.fb.control('', [
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
    // Load roles first
    this.adminService.getRoles().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.roles = response.data;
        console.log('Roles loaded:', this.roles);
      },
    });

    // Check if we're in edit mode by looking for ID in route params
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.adminId = params['id'];
        this.loadAdminData();
        // In edit mode, password fields are optional
        this.form.controls.password.clearValidators();
        this.form.controls.checkPassword.clearValidators();
        this.form.controls.checkPassword.setValidators([this.confirmationValidator.bind(this)]);
      } else {
        // In create mode, password is required
        this.isEditMode = false;
        this.form.controls.password.setValidators([Validators.required]);
        this.form.controls.checkPassword.setValidators([
          Validators.required,
          this.confirmationValidator.bind(this),
        ]);
      }
      // Update validators
      this.form.controls.password.updateValueAndValidity();
      this.form.controls.checkPassword.updateValueAndValidity();
    });

    this.form.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.controls.checkPassword.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (file) {
      // Validate file size (max 5MB)
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSizeInBytes) {
        this.error = 'Image must be 5MB or smaller';
        input.value = ''; // Clear the input
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.error = 'Only JPEG and PNG images are allowed';
        input.value = ''; // Clear the input
        return;
      }

      this.selectedFile = file;
      this.error = null;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  uploadImage(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(null);
        return;
      }

      this.isUploadingImage = true;
      this.imageService.uploadImage(
        this.selectedFile,
        'admin/avatars',
        'avatar',
        { width: 300, height: 300, crop: 'fit' },
        ['admin', 'avatar']
      ).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.isUploadingImage = false;
          if (response.success && response.data?.file?.secure_url) {
            resolve(response.data.file.secure_url);
          } else {
            this.error = 'Failed to upload image';
            reject(new Error('Failed to upload image'));
          }
        },
        error: (error) => {
          this.isUploadingImage = false;
          this.error = 'Failed to upload image';
          console.error('Image upload error:', error);
          reject(error);
        }
      });
    });
  }

  loadAdminData(): void {
    if (!this.adminId) return;
    
    this.isLoading = true;
    this.adminService.getUserById(this.adminId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (admin) => {
        console.log('Admin data loaded:', admin);
        console.log('Admin role_id:', admin.role_id);
        console.log('Admin role object:', admin.role);
        console.log('Available roles:', this.roles);
        
        // Split full_name into first and last name
        const nameParts = admin.full_name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        // Try to find the matching role
        const matchingRole = this.roles.find(r => r.value === admin.role_id);
        console.log('Matching role found:', matchingRole);

        // Set existing avatar if available
        if (admin.avatar) {
          this.imagePreview = admin.avatar;
        }

        // Wait a bit to ensure roles are loaded, then patch the form
        setTimeout(() => {
          this.form.patchValue({
            email: admin.email,
            firstName: firstName,
            lastName: lastName,
            phone: admin.phone_number,
            role: admin.role_id.toString(),
          });
          
          console.log('Form patched with role value:', admin.role_id.toString());
          console.log('Form role control value:', this.form.controls.role.value);
        }, 100);
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading admin data:', error);
        this.error = 'Failed to load admin data';
        this.isLoading = false;
      },
    });
  }

  async submitForm(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    
    if (this.form.valid) {
      try {
        const { email, password, firstName, lastName, phone, role } = this.form
          .value as Record<string, string>;
        
        // Upload image if selected
        let avatarUrl: string | null = null;
        if (this.selectedFile) {
          avatarUrl = await this.uploadImage();
        } else if (this.imagePreview && this.isEditMode) {
          // Keep existing avatar if no new file selected in edit mode
          avatarUrl = this.imagePreview;
        }
        
        const adminData = {
          email,
          full_name: firstName + " " + lastName,
          phone_number: phone,
          role_id: parseInt(role),
          ...(avatarUrl && { avatar: avatarUrl }),
        };

        if (this.isEditMode && this.adminId) {
          // Update existing admin
          const updateData = password ? { ...adminData, password } : adminData;
          this.adminService
            .updateUser(this.adminId, updateData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                this.isLoading = false;
                this.error = null;
                console.log('Admin updated successfully:', response);
                this.router.navigate(['/main/admin-management']);
              },
              error: (error) => {
                console.error('Error updating admin:', error);
                this.error = 'Failed to update admin';
                this.isLoading = false;
              },
            });
        } else {
          // Create new admin
          this.adminService
            .addAdmin({
              ...adminData,
              password: password!,
              phone: phone,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (response) => {
                this.isLoading = false;
                this.error = null;
                console.log('Admin added successfully:', response);
                this.router.navigate(['/main/admin-management']);
              },
              error: (error) => {
                console.error('Error adding admin:', error);
                this.error = 'Failed to add admin';
                this.isLoading = false;
              },
            });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        this.error = 'Failed to upload image';
        this.isLoading = false;
      }
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
