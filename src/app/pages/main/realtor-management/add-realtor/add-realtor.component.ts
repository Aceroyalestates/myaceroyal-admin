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
import { ImageService } from 'src/app/core/services/image.service';
import { RealtorService } from 'src/app/core/services/realtor.service';
import { CountryInterface, StateInterface } from 'src/app/core/models/generic';
import { AdminService } from 'src/app/core/services/admin.service';

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

  // For selects
  nationalities: CountryInterface[] = [];
  states: StateInterface[] = [];

  // For avatar
  avatarUrl: string | null = null;
  uplloadedAvatarId: string | null = null;
  validateForm = this.fb.group({
    full_name: this.fb.control('', [Validators.required]),
    email: this.fb.control('', [Validators.email, Validators.required]),
    phone_number: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    checkPassword: this.fb.control('', [
      Validators.required,
      (control) => this.confirmationValidator(control),
    ]),
    gender: this.fb.control('', [Validators.required]),
    date_of_birth: this.fb.control('', [Validators.required]),
    nationality_id: this.fb.control('', [Validators.required]),
    states_id: this.fb.control('', [Validators.required]),
    address: this.fb.control('', [Validators.required]),
    bank_verification_number: this.fb.control('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    national_identity_number: this.fb.control('', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]),
    avatar: this.fb.control<File | null>(null),
    avatar_url: this.fb.control(''),
  });

  constructor(private imageService: ImageService, private realtorService: RealtorService, private adminService: AdminService) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  code: number | null = null;

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateForm.controls.checkPassword.updateValueAndValidity();
      });

    this.validateForm.controls.nationality_id.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onCountryChange();
      });
    this.fetchCountries();
  }

  onCountryChange(): void {
    const nationality_id = this.validateForm.controls.nationality_id.value;
    const selectedCountry = this.nationalities.find(
      (country) => String(country.id) === String(nationality_id)
    );
    // Store the country code if found, else null
    this.code = selectedCountry ? selectedCountry.id : null;
    if (this.code) {
      this.fetchStatesByCountry(String(this.code));
    } else {
      this.states = [];
    }
  }
  // Fetch countries and states
  fetchCountries(): void {
    this.adminService.getCountries().subscribe({
      next: (response) => {
        this.nationalities = response.data;
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
      }
    });
  }

  fetchStatesByCountry(country_code: string): void {
    this.adminService.getStates(country_code).subscribe({
      next: (response) => {
        this.states = response.data.states;
      },
      error: (error) => {
        console.error('Error fetching states:', error);
      }
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('Form Data:', this.validateForm.value);
      // TODO: send to API
      const payload = {
        full_name: this.validateForm.value.full_name,
        email: this.validateForm.value.email,
        phone_number: this.validateForm.value.phone_number,
        password: this.validateForm.value.password,
        gender: this.validateForm.value.gender,
        date_of_birth: this.validateForm.value.date_of_birth,
        nationality_id: this.validateForm.value.nationality_id,
        states_id: this.validateForm.value.states_id,
        address: this.validateForm.value.address,
        bank_verification_number: this.validateForm.value.bank_verification_number,
        national_identity_number: this.validateForm.value.national_identity_number,
        avatar: this.validateForm.value.avatar_url,
      };

      this.realtorService.createRealtor(payload).subscribe({
        next: (response) => {
          console.log('Realtor created:', response);
          this.validateForm.reset()
        },
        error: (error) => {
          console.error('Error creating realtor:', error);
        }
      });

      console.log('Submitting payload:', payload);
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
    return null;
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.uplloadedAvatarId) {
        console.log('Previous file ID to delete:', this.uplloadedAvatarId);
        this.imageService.deleteImage(this.uplloadedAvatarId).subscribe({
          next: (response) => {
            console.log('Previous image deleted successfully:', response);
          },
          error: (error) => {
            console.error('Error deleting previous image:', error);
          },
        });
        this.uplloadedAvatarId = null;
      }
      this.imageService.uploadImage1(file, "realtor/images").subscribe({
        next: (response) => {
          this.validateForm.patchValue({ avatar_url: response.data.file.url });
          this.uplloadedAvatarId = response.data.file.public_id

          console.log('Image uploaded successfully:', response);
        },
        error: (error) => {
          console.error('Error uploading image:', error);
        },
      });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.validateForm.patchValue({ avatar: file });
    }
  }
}
