// src/app/business-customer-stepper/steps/banking-preferances/banking-preferances.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// NG-ZORRO Modules
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

interface Company {
  id?: number;
  companyName: string;
  registrationNumber: string;
  telephoneNumber: number | null; // Changed to number
  email: string;
  phoneNumber?: number | null; // Changed to number
  telephoneCountryCode?: string; // Added country code
  phoneCountryCode?: string; // Added country code
  description?: string;
}

interface BankReference {
  id?: number;
  bankName: string;
  branchName?: string;
  accountType: string;
  accountNumber: number | null; // Changed to number
  creationDate: Date | null;
  branch?: string;
  currencyType?: string;
}

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

@Component({
  selector: 'app-banking-preferences',
  templateUrl: './banking-preferances.component.html',
  styleUrls: ['./banking-preferances.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzStepsModule,
    NzIconModule,
    NzGridModule,
    NzMessageModule,
    NzCardModule,
    NzRadioModule,
    NzTableModule,
    NzDrawerModule,
    NzEmptyModule,
    NzInputNumberModule,
    FormsModule
  ]
})
export class BankingPreferancesComponent {
  @Output() formData = new EventEmitter<any>();

  companyForm!: FormGroup;
  isAddCompanyVisible = false;
  companyList: Company[] = [];
  bankReferences: BankReference[] = [
    {
      bankName: '',
      accountType: '',
      currencyType: '',
      accountNumber: null, // Changed to null for number input
      creationDate: null,
      branch: ''
    }
  ];

  // Country codes list
  countryCodes: CountryCode[] = [
    { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+233', country: 'Ghana', flag: '🇬🇭' },
    { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
    { code: '+256', country: 'Uganda', flag: '🇺🇬' },
    { code: '+260', country: 'Zambia', flag: '🇿🇲' },
    { code: '+267', country: 'Botswana', flag: '🇧🇼' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' }
  ];

  constructor(private fb: FormBuilder) {
    this.initForms();
    this.setupFormChanges();
    // Initial emit for default values
    setTimeout(() => this.emitFormData(), 100);
  }

  private initForms(): void {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      telephoneNumber: [null], // Changed to null for number input
      telephoneCountryCode: ['+263'], // Default to Zimbabwe
      email: ['', [Validators.email]],
      phoneNumber: [null], // Changed to null for number input
      phoneCountryCode: ['+263'], // Default to Zimbabwe
      description: ['']
    });
  }

  private setupFormChanges(): void {
    // Emit data whenever bank references or company list changes
    // Consider adding specific form change listeners for bank references if they are also Reactive Forms
    // For now, rely on manual calls to emitFormData after modification
  }

  // Formatter functions for number inputs
  accountNumberFormatter = (value: number): string => {
    // Format account number with spaces for readability
    return value ? value.toString().replace(/\B(?=(\d{4})+(?!\d))/g, ' ') : '';
  };

  accountNumberParser = (value: string): string => {
    // Remove spaces and non-numeric characters
    return value.replace(/\s/g, '').replace(/[^\d]/g, '');
  };

  phoneNumberFormatter = (value: number): string => {
    // Format phone number (you can customize this based on your country format)
    if (!value) return '';
    const str = value.toString();
    // Example format for Zimbabwe: 77 123 4567
    if (str.length >= 9) {
      return str.replace(/(\d{2})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    return str;
  };

  phoneNumberParser = (value: string): string => {
    // Remove all non-numeric characters
    return value.replace(/[^\d]/g, '');
  };

  public emitFormData(): void {
    const bankingData = {
      accountDetails: this.bankReferences.map(ref => ({
        id: ref.id || Math.floor(Math.random() * 10000000000),
        bankName: ref.bankName,
        branchName: ref.branchName || ref.branch,
        accountType: ref.accountType,
        currency: ref.currencyType,
        accountNumber: ref.accountNumber?.toString() || '', // Convert to string for API
        creationDate: ref.creationDate ? this.formatDate(ref.creationDate) : '',
        branch: ref.branchName || ref.branch,
        currencyType: ref.currencyType
      })),
      affiliatedCompanies: this.companyList.map(company => ({
        id: company.id || Math.floor(Math.random() * 10000000000),
        registrationNumber: company.registrationNumber,
        companyName: company.companyName,
        telephoneNumber: company.telephoneNumber ? `${company.telephoneCountryCode || '+263'}${company.telephoneNumber}` : '', // Include country code
        email: company.email,
        description: company.description,
        phoneNumber: company.phoneNumber ? `${company.phoneCountryCode || '+263'}${company.phoneNumber}` : '' // Include country code
      }))
    };

    this.formData.emit({ bankingReferences: bankingData, isValid: this.isFormValid() });
  }

  private isFormValid(): boolean {
    // Check if at least one bank reference has required fields
    const hasValidBankRef = this.bankReferences.some(ref =>
      ref.bankName.trim() !== '' &&
      ref.accountType !== '' &&
      ref.currencyType !== '' &&
      ref.accountNumber !== null &&
      ref.creationDate !== null
    );

    return hasValidBankRef;
  }

  showAddCompanyDrawer(): void {
    this.isAddCompanyVisible = true;
    this.companyForm.reset();
    // Set default country codes
    this.companyForm.patchValue({
      telephoneCountryCode: '+263',
      phoneCountryCode: '+263'
    });
  }

  closeAddCompanyDrawer(): void {
    this.isAddCompanyVisible = false;
  }

  addCompany(): void {
    if (this.companyForm.valid) {
      const newCompany: Company = {
        id: Math.floor(Math.random() * 10000000000),
        companyName: this.companyForm.value.companyName,
        registrationNumber: this.companyForm.value.registrationNumber,
        telephoneNumber: this.companyForm.value.telephoneNumber,
        telephoneCountryCode: this.companyForm.value.telephoneCountryCode,
        email: this.companyForm.value.email,
        phoneNumber: this.companyForm.value.phoneNumber,
        phoneCountryCode: this.companyForm.value.phoneCountryCode,
        description: this.companyForm.value.description
      };

      this.companyList = [...this.companyList, newCompany];
      this.closeAddCompanyDrawer();
      this.emitFormData();
    } else {
      Object.values(this.companyForm.controls).forEach(control => {
        control.markAsTouched();
        control.updateValueAndValidity();
      });
    }
  }

  deleteCompany(index: number): void {
    this.companyList = this.companyList.filter((_, i) => i !== index);
    this.emitFormData();
  }

  addBankReference(): void {
    this.bankReferences = [...this.bankReferences, {
      bankName: '',
      branchName: '',
      accountType: '',
      currencyType: '',
      accountNumber: null, // Changed to null for number input
      creationDate: null,
      branch: ''
    }];
    this.emitFormData();
  }

  /**
   * Deletes a bank reference by index. If there is only one bank reference left, it will not be deleted.
   * Emits the updated bank references as form data after deletion.
   * @param index The index of the bank reference to be deleted.
   */
  deleteBankReference(index: number): void {
    if (this.bankReferences.length > 1) { // Keep at least one reference
      this.bankReferences = this.bankReferences.filter((_, i) => i !== index);
      this.emitFormData();
    }
  }

  // Helper to format date as YYYY-MM-DD
  private formatDate(date: Date | null): string {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
  }

  // Helper to format phone number display in table
  formatPhoneDisplay(countryCode: string | undefined, phoneNumber: number | null): string {
    if (!phoneNumber) return '';
    return `${countryCode || '+263'} ${this.phoneNumberFormatter(phoneNumber)}`;
  }
}