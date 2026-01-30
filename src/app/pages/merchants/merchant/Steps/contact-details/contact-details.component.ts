import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzFormModule,
    NzIconModule
  ]
})
export class ContactDetailsComponent implements OnInit {
  public countryCodes: { [key: string]: string } = {
    'United States': '+1',
    'Canada': '+1',
    'United Kingdom': '+44',
    'Zimbabwe': '+263'
  };
  public countries = Object.keys(this.countryCodes);

  contactDetailsForm!: FormGroup;
  @Output() formData = new EventEmitter<any>();
  @Input() initialData: any;
  isEditable = true;

  // Default data matching your JSON structure
  private defaultContactDetails = {
    primaryContactPerson: "",
    email: "",
    mobileNumber: "",
    officePhoneNumber: "",
    facebook: "",
    linkedin: "",
    skype: "",
    x: ""
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.setupFormValueChanges();

    if (this.initialData) {
      this.loadInitialData();
    } else {
      // Load default data if no initial data provided
      this.loadDefaultData();
    }
  }

  // Custom validator for phone numbers
  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Don't validate empty values, let required validator handle it
    }

    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
    const valid = phoneRegex.test(control.value);

    return valid ? null : { invalidPhone: true };
  }

  // Enhanced email validator
  static emailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailRegex.test(control.value);

    return valid ? null : { invalidEmail: true };
  }

  initForm(): void {
    this.contactDetailsForm = this.fb.group({
      primaryContactPerson: ['', [Validators.required]],
      email: ['', [Validators.required, ContactDetailsComponent.emailValidator]],
      mobilePrefix: ['+263'],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      officePhoneNumber: ['', [Validators.required]],
      facebook: [''],
      x: [''],
      linkedin: [''],
      skype: ['']
    });
  }

  private loadInitialData(): void {
    this.contactDetailsForm.patchValue({
      primaryContactPerson: this.initialData.primaryContactPerson || '',
      email: this.initialData.email || '',
      mobileNumber: this.initialData.mobileNumber || '',
      officePhoneNumber: this.initialData.officePhoneNumber || '',
      facebook: this.initialData.facebook || '',
      x: this.initialData.x || '',
      linkedin: this.initialData.linkedin || '',
      skype: this.initialData.skype || ''
    });
  }

  private loadDefaultData(): void {
    this.contactDetailsForm.patchValue({
      primaryContactPerson: this.defaultContactDetails.primaryContactPerson,
      email: this.defaultContactDetails.email,
      mobileNumber: this.defaultContactDetails.mobileNumber,
      officePhoneNumber: this.defaultContactDetails.officePhoneNumber,
      facebook: this.defaultContactDetails.facebook,
      x: this.defaultContactDetails.x,
      linkedin: this.defaultContactDetails.linkedin,
      skype: this.defaultContactDetails.skype
    });
  }

  private setupFormValueChanges(): void {
    this.contactDetailsForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.emitFormData();
      });

    // Emit initial form state
    setTimeout(() => {
      this.emitFormData();
    }, 100);
  }

  private emitFormData(): void {
    const formValue = this.contactDetailsForm.value;

    const contactDetails = {
      primaryContactPerson: formValue.primaryContactPerson || '',
      emailAddress: formValue.email || '',
      mobileNumber: formValue.mobileNumber ? `${formValue.mobilePrefix}${formValue.mobileNumber}` : '',
      officePhoneNumber: formValue.officePhoneNumber || '',
      facebook: formValue.facebook || '',
      x: formValue.x || '',
      linkedin: formValue.linkedin || '',
      skype: formValue.skype || ''
    };

    this.formData.emit({
      contactDetails: contactDetails,
      isValid: this.contactDetailsForm.valid,
      formErrors: this.getAllFormErrors(),
      stepName: 'Contact Details',
      timestamp: new Date().toISOString()
    });
  }

  private getAllFormErrors(): any {
    const formErrors: any = {};

    Object.keys(this.contactDetailsForm.controls).forEach(key => {
      const controlErrors = this.contactDetailsForm.get(key)?.errors;
      if (controlErrors) {
        formErrors[key] = controlErrors;
      }
    });

    return formErrors;
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.contactDetailsForm.get(controlName);
    return control?.touched && control?.hasError(errorName) || false;
  }

  getControlErrors(controlName: string): string[] {
    const control = this.contactDetailsForm.get(controlName);
    const errors: string[] = [];

    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        errors.push(`${this.getFieldLabel(controlName)} is required`);
      }
      if (control.errors['invalidEmail']) {
        errors.push('Please enter a valid email address');
      }
      if (control.errors['invalidPhone']) {
        errors.push('Please enter a valid phone number');
      }
    }

    return errors;
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      primaryContactPerson: 'Primary Contact Person',
      email: 'Email',
      mobileNumber: 'Mobile Number',
      officePhoneNumber: 'Office Phone Number'
    };
    return labels[controlName] || controlName.charAt(0).toUpperCase() + controlName.slice(1);
  }

  hasAnyError(controlName: string): boolean {
    const control = this.contactDetailsForm.get(controlName);
    return control?.touched && control?.invalid || false;
  }

  submitForm(): void {
    if (this.contactDetailsForm.valid) {
      this.emitFormData();
    } else {
      // Mark all fields as touched to show validation errors
      Object.values(this.contactDetailsForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  // Method to get current form data
  getFormData(): any {
    return this.contactDetailsForm.value;
  }

  // Method to check if form is valid
  isFormValid(): boolean {
    return this.contactDetailsForm.valid;
  }

  // Method to reset form
  resetForm(): void {
    this.contactDetailsForm.reset();
    this.loadDefaultData();
  }

  // Method to manually trigger form data emission (useful for parent component)
  triggerFormDataEmission(): void {
    this.emitFormData();
  }

  // Method to get form validation status with details
  getValidationStatus(): { isValid: boolean; errors: any; touchedFields: string[] } {
    const errors = this.getAllFormErrors();
    const touchedFields = Object.keys(this.contactDetailsForm.controls)
      .filter(key => this.contactDetailsForm.get(key)?.touched);

    return {
      isValid: this.contactDetailsForm.valid,
      errors: errors,
      touchedFields: touchedFields
    };
  }
}
