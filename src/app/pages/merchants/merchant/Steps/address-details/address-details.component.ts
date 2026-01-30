// src/app/business-customer-stepper/steps/address-details/address-details.component.ts

import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { CountriesAndCitiesData } from '../../../../shared/constants/dropdown.interface';
import { countriesAndCitiesData } from '../../../../shared/constants/countriesAndCitiesData';

@Component({
  selector: 'app-address-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzRadioModule,
    NzInputNumberModule
  ],
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.css']
})
export class AddressDetailsComponent implements OnInit {
  @Output() formData = new EventEmitter<any>();
  addressForm!: FormGroup;

  countriesAndCitiesData = countriesAndCitiesData;
  countries: string[] = [];
  selectedCountryCities: string[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.countries = Object.keys(this.countriesAndCitiesData);

    this.initializeForm();
    this.setupFormChanges();

    this.initializeForm();
    this.setupFormChanges();
    // Initial emit for default values
    setTimeout(() => this.emitFormData(), 100);
  }

  private initializeForm(): void {
    this.addressForm = this.fb.group({
      addressType: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      streetNumber: ['', Validators.required],
      streetName: ['', Validators.required],
      suburb: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      ownershipType: ['', Validators.required],
      homeOwnership: ['', Validators.required],
      residenceYears: [0, [Validators.required, Validators.min(0)]],
      residenceMonths: [0, [Validators.required, Validators.min(0), Validators.max(11)]],
      isSameAsPostalAddress: [null, Validators.required]
    });
  }

  // ADD THIS METHOD FOR HANDLING COUNTRY SELECTION
  public onCountryChange(event: any): void {
    const selectedCountry = event.target ? event.target.value : event; // Handle both native select and nz-select

    if (selectedCountry && this.countriesAndCitiesData[selectedCountry as keyof typeof this.countriesAndCitiesData]) {
      this.selectedCountryCities = this.countriesAndCitiesData[selectedCountry as keyof typeof this.countriesAndCitiesData];
    } else {
      this.selectedCountryCities = [];
    }

    // Reset city selection when country changes
    this.addressForm.patchValue({ city: '' });
  }


  private emitFormData(): void {
    const formValue = this.addressForm.value;

    // Create the single address object as per the API structure
    const addressData = {
      streetAddress: formValue.addressLine1,
      city: formValue.city,
      country: formValue.country,
      postalCode: formValue.postalCode,
      addressType: formValue.addressType,
      addressLine1: formValue.addressLine1,
      suburb: formValue.suburb,
      addressLine2: formValue.addressLine2 || '',
      streetName: formValue.streetName,
      streetNumber: formValue.streetNumber,
      homeOwnership: formValue.homeOwnership, // Default value as per API requirement
      ownershipType: formValue.ownershipType,
      residenceDuration: {
        years: formValue.residenceYears || 0,
        months: formValue.residenceMonths || 0
      },
      isSameAsPostalAddress: formValue.isSameAsPostalAddress
    };


    // Emit an object containing 'addressDetails' which is an array of one address
    this.formData.emit({
      addressInformation: [addressData],
      isValid: this.addressForm.valid
    });
  }

  private setupFormChanges(): void {
    this.addressForm.valueChanges.subscribe(() => {
      this.emitFormData(); // Always emit on change, validity checked in parent
    });
  }

  public changeNumber(controlName: string, change: number): void {
    const control = this.addressForm.get(controlName);
    if (control) {
      const currentValue = control.value || 0;
      let newValue: number;

      if (controlName === 'residenceMonths') {
        newValue = Math.max(0, Math.min(11, currentValue + change));
      } else if (controlName === 'residenceYears') {
        newValue = Math.max(0, Math.min(100, currentValue + change));
      } else {
        newValue = Math.max(0, currentValue + change);
      }

      control.setValue(newValue);
    }
  }

  public toggleSameAsPostal(value: boolean): void {
    const control = this.addressForm.get('isSameAsPostalAddress');
    if (control) {
      control.setValue(value);
    }
  }

  public onSubmit(): void {
    if (this.addressForm.valid) {
      this.emitFormData();
    } else {
      this.addressForm.markAllAsTouched();
      this.emitFormData(); // Emit invalid state
    }
  }

  // Helper method to check if a field has errors and is touched
  public hasError(fieldName: string, errorType?: string): boolean {
    const field = this.addressForm.get(fieldName);
    if (!field) return false;

    if (errorType) {
      return field.hasError(errorType) && field.touched;
    }
    return field.invalid && field.touched;
  }

  // Helper method to get error message for a field
  public getErrorMessage(fieldName: string): string {
    const field = this.addressForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    if (field.errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (field.errors['min']) {
      return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['min'].min}`;
    }
    if (field.errors['max']) {
      return `${this.getFieldDisplayName(fieldName)} must be at most ${field.errors['max'].max}`;
    }

    return 'Invalid input';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'addressType': 'Address Type',
      'addressLine1': 'Address Line 1',
      'streetNumber': 'Street Number',
      'streetName': 'Street Name',
      'suburb': 'Suburb',
      'city': 'City',
      'country': 'Country',
      'homeOwnership': 'Home Ownership',
      'postalCode': 'Postal Code',
      'ownershipType': 'Ownership Type',
      'residenceYears': 'Years of Residence',
      'residenceMonths': 'Months of Residence',
      'isSameAsPostalAddress': 'Same as Postal Address'
    };
    return displayNames[fieldName] || fieldName;
  }
}