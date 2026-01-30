import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CBZBranch {
  id: string;
  name: string;
}

export interface FacilityOption {
  id: string;
  name: string;
  selected: boolean;
}

export interface CardNetworkOption {
  id: string;
  name: string;
  selected: boolean;
}

export interface PricingParameter {
  parameter: string;
  value: string;
}

export interface TransactionType {
  type: string;
  requiresApproval: boolean;
}

// API Request Interface
export interface MerchantAPIRequest {
  addressInformation?: {
    addressType?: string;
    addressLine1?: string;
    addressLine2?: string;
    streetNumber?: string;
    streetName?: string;
    suburb?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    ownershipType?: string;
    residenceYears?: number;
    residenceMonths?: number;
    isSameAsPostalAddress?: boolean;
    homeOwnership?: string;
  };
  businessDetails?: {
    basicInformation?: {
      registeredName?: string;
      tradingName?: string;
      countryOfIncorporation?: string;
      certificateOfIncorporationNumber?: string;
      zimraBPNumber?: string;
      companyRegistrationDate?: string;
      companyDescription?: string;
    };
    industryInformation?: {
      industry?: string;
      industrySubCategory?: string;
    };
    contactInformation?: {
      email?: string;
      mobilePrefix?: string;
      mobileNumber?: string;
      telephoneNumber?: string;
      fax?: string;
    };
  };
  contactDetails?: {
    email?: string;
    phoneNumber?: string;
    telephoneNumber?: string;
    socialMedia?: {
      facebook?: string;
      x?: string;
      linkedin?: string;
      skype?: string;
    };
  };
  directors?: any[];
  formsOfOwnership?: {
    companyInformation?: {
      companyType?: string;
      registrationNumber?: string;
      numberOfEmployees?: number;
    };
    shareholders?: any[];
  };
  merchantInformation: {
    basicInformation: {
      tradingName: string;
      previousMerchantBank?: string;
      idNumber: string;
      fullName: string;
      cbzBranch: string;
      currentCbzAccountNumber: string;
      domiciliumAddress: string;
      signatureUpload?: File;
    };
    transactionTypesRequiringApproval: {
      telephoneOrders: boolean;
      mailOrders: boolean;
      telemarketing: boolean;
      internetComputerNetwork: boolean;
      recurringTransactions: boolean;
      cashAdvances: boolean;
      purchaseWithCashback: boolean;
    };
    facilitySelection: {
      pos: boolean;
      link: boolean;
      ecommerce: boolean;
      vPayments: boolean;
      ipos: boolean;
      mvisa: boolean;
    };
    cardNetworkSelection: {
      mastercard: boolean;
      visa: boolean;
      cbzZimswitch: boolean;
    };
    pricingAndLimits?: {
      transactionFee?: string;
      dailyLimit?: string;
      monthlyLimit?: string;
      settlementPeriod?: string;
    };
    transactionTypes?: {
      transactionType: string;
      requiresApproval: boolean;
    }[];
  };
  preferences?: {
    communicationPreferences?: {
      preferredCommunicationMethod?: string;
      preferredReminderMethod?: string;
      additionalEmail?: string;
      additionalPhonePrefix?: string;
      additionalPhone?: string;
    };
  };
  metadata?: {
    formVersion?: string;
    submissionDate?: string;
    lastModified?: string;
    status?: string;
    userId?: string;
    sessionId?: string;
  };
}

@Component({
  selector: 'app-merchant-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './merchant-account.component.html',
  styleUrls: ['./merchant-account.component.css']
})
export class MerchantAccountComponent implements OnInit {
  @Output() dataChange = new EventEmitter<{ merchantAccount: any; isValid: boolean; }>();

  private http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/customers/merchants';

  merchantForm: FormGroup;
  signatureFile: File | null = null;
  isSubmitting = false;
  submitError: string | null = null;
  submitSuccess = false;

  cbzBranches: CBZBranch[] = [
    { id: '1', name: 'Harare Main Branch' },
    { id: '2', name: 'Bulawayo Branch' },
    { id: '3', name: 'Mutare Branch' },
    { id: '4', name: 'Gweru Branch' },
    { id: '5', name: 'Masvingo Branch' }
  ];

  facilityOptions: FacilityOption[] = [
    { id: 'pos', name: 'POS', selected: false },
    { id: 'link', name: 'Link', selected: false },
    { id: 'ecommerce', name: 'E-commerce', selected: false },
    { id: 'vPayments', name: 'vPayments', selected: false },
    { id: 'ipos', name: 'iPOS', selected: false },
    { id: 'mvisa', name: 'mVisa', selected: false }
  ];

  cardNetworkOptions: CardNetworkOption[] = [
    { id: 'mastercard', name: 'MasterCard', selected: false },
    { id: 'visa', name: 'Visa', selected: false },
    { id: 'cbzZimswitch', name: 'CBZ/Zimswitch', selected: false }
  ];

  pricingParameters: PricingParameter[] = [
    { parameter: 'Floor Limit', value: '$0' },
    { parameter: 'MasterCard Commission', value: '2.5%' },
    { parameter: 'Visa Commission', value: '2%' },
    { parameter: 'CBZ/Zimswitch Commission', value: '1%' },
    { parameter: 'Minimum Monthly Fee (per POS)', value: '$2,000.00' },
    { parameter: 'VPayments General Merchant Fee', value: '$50 + agreed commission' },
    { parameter: 'VPayments Super Merchant Fee', value: '$250 + agreed commission' }
  ];

  transactionTypes: TransactionType[] = [
    { type: 'Telephone Orders', requiresApproval: true },
    { type: 'Mail Orders', requiresApproval: true },
    { type: 'Telemarketing', requiresApproval: true },
    { type: 'Internet/Computer Network', requiresApproval: true },
    { type: 'Recurring Transactions', requiresApproval: true },
    { type: 'Cash Advances', requiresApproval: true },
    { type: 'Purchase with Cash-back', requiresApproval: true }
  ];

  constructor(private formBuilder: FormBuilder) {
    this.merchantForm = this.formBuilder.group({
      previousMerchantBank: [''],
      idNumber: ['', Validators.required],
      fullName: ['', Validators.required],
      cbzBranch: ['', Validators.required],
      currentCbzAccountNumber: ['', Validators.required],
      tradingName: ['', Validators.required],
      domiciliumAddress: ['', Validators.required],
      signatureUpload: ['', Validators.required],

      // Transaction Types Requiring Bank Approval
      telephoneOrders: [false],
      mailOrders: [false],
      telemarketing: [false],
      internetComputerNetwork: [false],
      recurringTransactions: [false],
      cashAdvances: [false],
      purchaseWithCashback: [false],

      // Facility Selection
      pos: [false],
      link: [false],
      eCommerce: [false],
      vPayments: [false],
      iPOS: [false],
      mVisa: [false],

      // Card Network Selection
      mastercard: [false],
      visa: [false],
      cbzZimswitch: [false]
    });
  }

  ngOnInit(): void {
    // Subscribe to form value changes to emit data automatically
    this.merchantForm.valueChanges.subscribe(() => {
      this.emitFormData();
    });

    // Initialize form controls for facilities and card networks
    this.initializeFacilityControls();
    this.initializeCardNetworkControls();
  }

  private initializeFacilityControls(): void {
    this.facilityOptions.forEach(facility => {
      this.merchantForm.addControl(facility.id, this.formBuilder.control(facility.selected));

      this.merchantForm.get(facility.id)?.valueChanges.subscribe(value => {
        facility.selected = value;
        this.emitFormData();
      });
    });
  }

  private initializeCardNetworkControls(): void {
    this.cardNetworkOptions.forEach(network => {
      this.merchantForm.addControl(network.id, this.formBuilder.control(network.selected));

      this.merchantForm.get(network.id)?.valueChanges.subscribe(value => {
        network.selected = value;
        this.emitFormData();
      });
    });
  }

  // Emit form data including selected facilities and card networks
  private emitFormData(): void {
    const formData = {
      ...this.merchantForm.value,
      facilities: this.facilityOptions.filter(f => f.selected),
      cardNetworks: this.cardNetworkOptions.filter(c => c.selected),
      signatureFile: this.signatureFile
    };

    this.dataChange.emit({
      merchantAccount: formData,
      isValid: this.merchantForm.valid
    });
  }

  onFacilityChange(facilityId: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const facility = this.facilityOptions.find(f => f.id === facilityId);
    if (facility) {
      facility.selected = isChecked;
      this.merchantForm.get(facilityId)?.setValue(isChecked);
    }
  }

  onCardNetworkChange(cardNetworkId: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const cardNetwork = this.cardNetworkOptions.find(c => c.id === cardNetworkId);
    if (cardNetwork) {
      cardNetwork.selected = isChecked;
      this.merchantForm.get(cardNetworkId)?.setValue(isChecked);
    }
  }

  onSignatureFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.signatureFile = input.files[0];
      this.merchantForm.patchValue({
        signatureUpload: this.signatureFile.name
      });
    }
  }

  private buildApiPayload(): MerchantAPIRequest {
    const formValue = this.merchantForm.value;

    return {
      merchantInformation: {
        basicInformation: {
          tradingName: formValue.tradingName,
          previousMerchantBank: formValue.previousMerchantBank || '',
          idNumber: formValue.idNumber,
          fullName: formValue.fullName,
          cbzBranch: formValue.cbzBranch,
          currentCbzAccountNumber: formValue.currentCbzAccountNumber,
          domiciliumAddress: formValue.domiciliumAddress,
          signatureUpload: this.signatureFile || undefined
        },
        transactionTypesRequiringApproval: {
          telephoneOrders: formValue.telephoneOrders || false,
          mailOrders: formValue.mailOrders || false,
          telemarketing: formValue.telemarketing || false,
          internetComputerNetwork: formValue.internetComputerNetwork || false,
          recurringTransactions: formValue.recurringTransactions || false,
          cashAdvances: formValue.cashAdvances || false,
          purchaseWithCashback: formValue.purchaseWithCashback || false
        },
        facilitySelection: {
          pos: formValue.pos || false,
          link: formValue.link || false,
          ecommerce: formValue.eCommerce || false,
          vPayments: formValue.vPayments || false,
          ipos: formValue.iPOS || false,
          mvisa: formValue.mVisa || false
        },
        cardNetworkSelection: {
          mastercard: formValue.mastercard || false,
          visa: formValue.visa || false,
          cbzZimswitch: formValue.cbzZimswitch || false
        },
        pricingAndLimits: {
          transactionFee: '2.5%',
          dailyLimit: '$10,000',
          monthlyLimit: '$250,000',
          settlementPeriod: 'T+1'
        },
        transactionTypes: this.transactionTypes.map(tt => ({
          transactionType: tt.type,
          requiresApproval: tt.requiresApproval
        }))
      },
      metadata: {
        formVersion: '1.0',
        submissionDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'submitted',
        userId: 'current-user-id', // Replace with actual user ID
        sessionId: 'current-session-id' // Replace with actual session ID
      }
    };
  }

  private submitToAPI(payload: MerchantAPIRequest): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post(this.apiUrl, payload, { headers });
  }

  onSubmit(): void {
    if (this.merchantForm.valid) {
      this.isSubmitting = true;
      this.submitError = null;
      this.submitSuccess = false;

      const apiPayload = this.buildApiPayload();

      // Log the payload for debugging

      this.submitToAPI(apiPayload).subscribe({
        next: (response) => {
          this.submitSuccess = true;
          this.isSubmitting = false;
          this.emitFormData();

          // Optional: Reset form or redirect
          // this.merchantForm.reset();
        },
        error: (error) => {
          console.error('Submission failed:', error);
          this.submitError = error.error?.message || 'Failed to submit merchant application. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.merchantForm.controls).forEach(key => {
      this.merchantForm.get(key)?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.merchantForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get selected facility names for display
  getSelectedFacilities(): string[] {
    return this.facilityOptions.filter(f => f.selected).map(f => f.name);
  }

  // Helper method to get selected card networks for display
  getSelectedCardNetworks(): string[] {
    return this.cardNetworkOptions.filter(c => c.selected).map(c => c.name);
  }

  // Method to reset form
  resetForm(): void {
    this.merchantForm.reset();
    this.signatureFile = null;
    this.facilityOptions.forEach(f => f.selected = false);
    this.cardNetworkOptions.forEach(c => c.selected = false);
    this.submitError = null;
    this.submitSuccess = false;
  }
}