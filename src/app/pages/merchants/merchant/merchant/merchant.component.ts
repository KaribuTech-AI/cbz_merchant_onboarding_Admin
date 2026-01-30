import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { BusinessDetailsComponent } from '../Steps/business-details/business-details.component';
import { AddressDetailsComponent } from '../Steps/address-details/address-details.component';
import { FormsOfOwnershipComponent } from '../Steps/forms-of-ownership/forms-of-ownership.component';
import { BankingPreferancesComponent } from '../Steps/banking-preferances/banking-preferances.component';
import { DirectorsComponent } from '../Steps/directors/directors.component';
import { DocumentsComponent } from '../Steps/documents/documents.component';
import { PreferancesComponent } from '../Steps/preferances/preferances.component';
import { CaptchaComponent } from '../../captcha/captcha.component';
import { ProductOfferComponent } from '../product-offer/product-offer.component';
import { ContactDetailsComponent } from '../Steps/contact-details/contact-details.component';
import { MerchantAccountComponent } from '../Steps/merchant-account/merchant-account.component';
import { APP_ROUTES } from '../../../shared/app-route.constants';
@Component({
  selector: 'app-merchant',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BusinessDetailsComponent,
    AddressDetailsComponent,
    FormsOfOwnershipComponent,
    BankingPreferancesComponent,
    DirectorsComponent,
    DocumentsComponent,
    PreferancesComponent,
    CaptchaComponent,
    ProductOfferComponent,
    NzModalModule,
    HttpClientModule,
    MerchantAccountComponent,
    ContactDetailsComponent
  ],
  templateUrl: './merchant.component.html',
  styleUrl: './merchant.component.css'
})
export class MerchantComponent {
  currentStep = 0;
  isLoading = false;
  isVerificationComplete = false;
  isRegistrationComplete = false;
  userPhoneNumber: string = '+263786350965';

  // Form data storage
  businessDetailsData: {
    businessDetails: any;
    contactDetails: any;
    formsOfOwnership: any;
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string;
  } | null = null;

  contactDetailsData: {
    contactDetails: any;
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string;
  } | null = null;

  addressDetailsData: {
    addressDetails: any[];
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string;
  } | null = null;

  ownershipFormData: {
    ownershipDetails: any;
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string;
  } | null = null;

  merchantAccountData: {
    merchantAccount: any;
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string;
  } | null = null;

  bankingReferencesData: {
    bankingReferences: any;
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string;
  } | null = null;

  directorsFormData: {
    directors: any[];
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string;
  } | null = null;

  documentsFormData: {
    documents: any[];
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string;
  } | null = null;

  preferencesFormData: {
    preferences: any;
    isValid: boolean
  } | null = null;

  productOfferData: {
    productOfferData: any;
    isValid: boolean
  } | null = null;

  // Final API payload structure
  customerData: any = {
    addressInformation: {},
    businessDetails: {
      "basicInformation": {
        "registeredName": "",
        "tradingName": "",
        "registrationNumber": "",
        "vatNumber": ""
      },
      "industryInformation": {
        "industry": "",
        "industrySubCategory": ""
      },
      "companyDescription": ""
    },
    contactDetails: {
      "primaryContactPerson": "",
      "emailAddress": "",
      "mobileNumber": "",
      "officePhoneNumber": ""
    },
    directors: [],
    formsOfOwnership: {
      "ownershipType": "",
      "registrationDate": ""
    },
    merchantInformation: {},
    preferences: {},
    metadata: {
      createdBy: 'self-service-portal',
      sourceSystem: 'WebApp'
    }
  };

  steps = [
    { id: 0, name: 'Business Details', component: 'business-details', isValid: false },
    { id: 1, name: 'Contact Details', component: 'contact-details', isValid: false },
    { id: 2, name: 'Address Details', component: 'address-details', isValid: false },
    { id: 3, name: 'Forms Of Ownership', component: 'forms-of-ownership', isValid: false },
    { id: 4, name: 'Merchant Account', component: 'merchant-account', isValid: false },
    { id: 5, name: 'Banking References', component: 'banking-references', isValid: false },
    { id: 6, name: 'Directors', component: 'directors', isValid: false },
    { id: 7, name: 'Documents', component: 'documents', isValid: false },
    { id: 8, name: 'Preferences', component: 'preferences', isValid: false },
    { id: 9, name: 'Product Offer', component: 'product-offer', isValid: false },
    { id: 10, name: 'Send OTP', component: 'captcha', isValid: false }
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private router: Router,
    private modal: NzModalService,
    private http: HttpClient
  ) { }

  // ID Number validation method
  validateIdNumber(idNumber: string): boolean {
    if (!idNumber) return false;

    // Remove any spaces or dashes for validation
    const cleanId = idNumber.replace(/[\s-]/g, '');

    // Check if it matches the required formats:
    // XX-XXXXXX-X-XX (12 digits total) or XX-XXXXXXX-X-XX (13 digits total)
    const pattern1 = /^\d{2}-\d{6}-\d{1}-\d{2}$/; // XX-XXXXXX-X-XX
    const pattern2 = /^\d{2}-\d{7}-\d{1}-\d{2}$/; // XX-XXXXXXX-X-XX

    return pattern1.test(idNumber) || pattern2.test(idNumber);
  }

  // Method to validate all directors' ID numbers
  validateDirectorsIdNumbers(): boolean {
    if (!this.directorsFormData?.directors || this.directorsFormData.directors.length === 0) {
      return true; // No directors to validate
    }

    for (const director of this.directorsFormData.directors) {
      const idNumber = director.personalDetails?.idNumber || director.personalDetails?.identification?.number;
      if (idNumber && !this.validateIdNumber(idNumber)) {
        this.message.error(`Invalid ID number format for director: ${director.personalDetails?.firstName || 'Unknown'}. Required format: XX-XXXXXX-X-XX or XX-XXXXXXX-X-XX`);
        return false;
      }
    }
    return true;
  }

  navigateTo(stepId: number): void {
    this.currentStep = stepId;
    this.cdr.detectChanges();
  }

  isActive(stepId: number): boolean {
    return this.currentStep === stepId;
  }

  getCurrentStepTitle(): string {
    const currentStepObj = this.steps.find(step => step.id === this.currentStep);
    return currentStepObj ? currentStepObj.name : '';
  }

  goBack(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.cdr.detectChanges();
    }
  }

  goNext(): void {
    // Validate ID numbers before proceeding from directors step
    if (this.currentStep === 6) { // Directors step
      if (!this.validateDirectorsIdNumbers()) {
        return; // Don't proceed if validation fails
      }
    }

    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.cdr.detectChanges();
    }
  }

  isCurrentStepValid(): boolean {
    const currentStepObj = this.steps[this.currentStep];
    if (!currentStepObj) return false;

    switch (currentStepObj.component) {
      case 'business-details':
        return this.businessDetailsData?.isValid || false;
      case 'contact-details':
        return this.contactDetailsData?.isValid || false;
      case 'address-details':
        return this.addressDetailsData?.isValid || false;
      case 'forms-of-ownership':
        return this.ownershipFormData?.isValid || false;
      case 'merchant-account':
        return this.merchantAccountData?.isValid || false;
      case 'banking-references':
        return this.bankingReferencesData?.isValid || false;
      case 'directors':
        return this.directorsFormData?.isValid || false;
      case 'documents':
        return this.documentsFormData?.isValid || false;
      case 'preferences':
        return this.preferencesFormData?.isValid || false;
      case 'product-offer':
        return this.productOfferData?.isValid || false;
      case 'captcha':
        return this.isVerificationComplete;
      default:
        return false;
    }
  }

  handleVerificationComplete(event: any): void {
    if (event.isVerified) {
      this.isVerificationComplete = true;
      const captchaStep = this.steps.find(step => step.component === 'captcha');
      if (captchaStep) {
        captchaStep.isValid = true;
      }
      this.cdr.detectChanges();
    }
  }

 navigateToLandingPage(): void {
    const confirmExit = confirm('Are you sure you want to exit? All unsaved progress will be lost.');

    if (confirmExit) {
      this.router.navigate([APP_ROUTES.LANDING_PAGE]);
    }
  }

  saveProgress(): void {
    this.message.success('Progress saved successfully!');
  }

  canNavigateToStep(stepId: number): boolean {
    return true;
  }

  // Method to clear all form data and reset to step 1
  clearAllFormData(): void {
    // Clear all form data
    this.businessDetailsData = null;
    this.contactDetailsData = null;
    this.addressDetailsData = null;
    this.ownershipFormData = null;
    this.merchantAccountData = null;
    this.bankingReferencesData = null;
    this.directorsFormData = null;
    this.documentsFormData = null;
    this.preferencesFormData = null;
    this.productOfferData = null;

    // Reset verification states
    this.isVerificationComplete = false;
    this.isRegistrationComplete = false;

    // Reset customer data to initial state
    this.customerData = {
      addressInformation: {},
      businessDetails: {
        "basicInformation": {
          "registeredName": "",
          "tradingName": "",
          "registrationNumber": "",
          "vatNumber": ""
        },
        "industryInformation": {
          "industry": "",
          "industrySubCategory": ""
        },
        "companyDescription": ""
      },
      contactDetails: {
        "primaryContactPerson": "",
        "emailAddress": "",
        "mobileNumber": "",
        "officePhoneNumber": ""
      },
      directors: [],
      formsOfOwnership: {
        "ownershipType": "",
        "registrationDate": ""
      },
      merchantInformation: {},
      preferences: {},
      metadata: {
        createdBy: 'self-service-portal',
        sourceSystem: 'WebApp'
      }
    };

    // Reset all steps validity
    this.steps.forEach(step => {
      step.isValid = false;
    });

    // Navigate to step 1 (Business Details)
    this.currentStep = 0;
    this.cdr.detectChanges();

  }

  // Form data update handlers
  updateBusinessDetails(data: {
    businessDetails: any;
    contactDetails: any;
    formsOfOwnership: any;
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string
  }): void {
    this.businessDetailsData = data;
    this.updateStepValidity(0, data.isValid);

    // Correctly map the emitted data to the final customerData payload

    // Map businessDetails object
    if (data.businessDetails) {
      // Use object spread to merge the nested objects correctly
      this.customerData.businessDetails = {
        ...this.customerData.businessDetails, // Preserve any existing data
        ...data.businessDetails // Overwrite with the new data from the child
      };
    }

    // Map the contactDetails object from the child's output to the root-level key
    if (data.contactDetails) {
      this.customerData.contactDetails = data.contactDetails;
    }

    // Map the formsOfOwnership object from the child's output to the root-level key
    if (data.formsOfOwnership) {
      this.customerData.formsOfOwnership = data.formsOfOwnership;
    }

  }

  updateContactDetails(data: {
    contactDetails: any;
    isValid: boolean;
    formErrors?: any;
    stepName?: string;
    timestamp?: string
  }): void {
    this.contactDetailsData = data;
    this.updateStepValidity(1, data.isValid);

    // Map to new API structure
    const cd = data.contactDetails;
    this.customerData.contactDetails = {
      primaryContactPerson: cd.primaryContactPerson || cd.contactPersonName || '',
      emailAddress: cd.email || cd.emailAddress || '',
      mobileNumber: cd.phoneNumber || cd.mobileNumber || '',
      officePhoneNumber: cd.telephoneNumber || cd.officePhoneNumber || '',
      facebook: cd.facebook || '',
      linkedin: cd.linkedin || '',
      skype: cd.skype || '',
      x: cd.x || ''
    };

  }

  updateAddressDetails(data: { addressDetails: any[]; isValid: boolean }): void {
    this.addressDetailsData = data;
    this.updateStepValidity(2, data.isValid);

    // Map to new API structure - use first address
    if (data.addressDetails && data.addressDetails.length > 0) {
      const address = data.addressDetails[0];
      this.customerData.addressInformation = {
        streetAddress: address.streetAddress || address.addressLine1 || '',
        city: address.city || '',
        province: address.province || address.city || '',
        postalCode: address.postalCode || '',
        country: address.country || 'Zimbabwe',
        zimraBPNumber: this.businessDetailsData?.businessDetails?.basicInformation?.vatNumber || ''
      };
    }

  }

  updateOwnershipDetails(data: { ownershipDetails: any; isValid: boolean }): void {
    this.ownershipFormData = data;
    this.updateStepValidity(3, data.isValid);

    // Map to new API structure
    const od = data.ownershipDetails;
    this.customerData.formsOfOwnership = {
      ownershipType: od.ownershipType || od.typeOfOwnership || '',
      registrationDate: od.registrationDate || od.companyRegistrationDate || '',
      numberOfEmployees: od.noOfEmployees || od.numberOfEmployees || 0,
      annualTurnover: od.annualTurnover || 0
    };

  }

  updateMerchantAccount(data: { merchantAccount: any; isValid: boolean }): void {
    this.merchantAccountData = data;
    this.updateStepValidity(4, data.isValid);

    // Map to new API structure
    const ma = data.merchantAccount;
    this.customerData.merchantInformation = {
      merchantId: ma.merchantId || '',
      merchantCategoryCode: ma.merchantCategoryCode || ma.mcc || '',
      merchantType: ma.merchantType || '',
      processingVolume: ma.processingVolume || 0,
      averageTransactionAmount: ma.averageTransactionAmount || 0
    };

  }

  updateBankingReferences(data: { bankingReferences: any; isValid: boolean }): void {
    this.bankingReferencesData = data;
    this.updateStepValidity(5, data.isValid);

    // Map banking references (if needed for additional API calls)
    this.customerData.bankingReferences = data.bankingReferences;

  }

  updateDirectors(data: { directors: any[]; isValid: boolean }): void {

    // Validate ID numbers before updating
    if (data.directors && data.directors.length > 0) {
      for (const director of data.directors) {
        const idNumber = director.personalDetails?.idNumber || director.personalDetails?.identification?.number;
        if (idNumber && !this.validateIdNumber(idNumber)) {
          // Mark the step as invalid if ID validation fails
          this.directorsFormData = { ...data, isValid: false };
          this.updateStepValidity(6, false);
          this.message.error(`Invalid ID number format for director: ${director.personalDetails?.firstName || 'Unknown'}. Required format: XX-XXXXXX-X-XX or XX-XXXXXXX-X-XX`);
          return;
        }
      }
    }

    this.directorsFormData = data;
    this.updateStepValidity(6, data.isValid);

    // Map to new API structure
    this.customerData.directors = (data.directors || []).map((director: any) => {
      const pd = director.personalDetails || {};
      return {
        firstName: pd.firstName || pd.firstname || '',
        lastName: pd.lastName || pd.lastname || '',
        middleName: pd.middleName || pd.middlename || '',
        idNumber: pd.idNumber || pd.identification?.number || '',
        identificationType: pd.identificationType || pd.identification?.type || '',
        email: pd.email || director.contactDetails?.email || '',
        phoneNumber: pd.phoneNumber || pd.mobileNumber || director.contactDetails?.phoneNumber || '',
        dateOfBirth: pd.dateOfBirth || '',
        nationality: pd.nationality || 'ZIMBABWEAN',
        position: director.position || 'Director',
        shareholding: director.shareholding || 0
      };
    });

  }

  updateDocuments(data: { documents: any[]; isValid: boolean }): void {
    this.documentsFormData = data;
    this.updateStepValidity(7, data.isValid);

    // Store documents for later processing or API calls
    this.customerData.documents = data.documents || [];

  }

  updatePreferences(data: { preferences: any; isValid: boolean }): void {
    this.preferencesFormData = data;
    this.updateStepValidity(8, data.isValid);

    // Map to new API structure
    const prefs = data.preferences;
    this.customerData.preferences = {
      receiveNotifications: prefs.receiveNotifications !== false,
      notificationMethod: prefs.preferredCommMethod === 'Email' ? 'EMAIL' :
        prefs.preferredCommMethod === 'Phone Call' ? 'PHONE' : 'EMAIL'
    };

  }

  updateProductOffer(data: { productOfferData: any; isValid: boolean }): void {
    this.productOfferData = data;
    this.updateStepValidity(9, data.isValid);

    // Store product offer data for additional processing if needed
    this.customerData.productOffer = data.productOfferData;

  }

  private updateStepValidity(stepId: number, isValid: boolean): void {
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.isValid = isValid;
    }
    this.cdr.detectChanges();
  }

  // Document upload method
  async uploadDocument(file: File, folderName: string = 'titan'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.http.post<any>(
        `/api/v1/sharepoint/upload-file?folderName=${folderName}`,
        formData
      ).toPromise();

      return response.url || response.sharePointUrl || '';
    } catch (error) {
      console.error('Document upload failed:', error);
      this.message.error('Failed to upload document. Please try again.');
      throw error;
    }
  }

  submitRegistration(): void {
    // Final validation check for directors' ID numbers before submission
    if (!this.validateDirectorsIdNumbers()) {
      this.message.error('Please correct the ID number formats before submitting.');
      this.currentStep = 6; // Navigate back to directors step
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;

    // Build final payload according to new API structure
    this.buildFinalPayload();


    const apiUrl = '/api/v1/self-service/sync/merchants';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post(apiUrl, this.customerData, { headers }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.handleSuccessResponse();
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isLoading = false;
        this.handleErrorResponse(error);
      },
      complete: () => {
      }
    });
  }

  private handleSuccessResponse(): void {
    this.message.success('Merchant registration submitted successfully!');
    this.isRegistrationComplete = true;
    this.cdr.detectChanges();
    this.showFinalSuccessModal();
  }

  private handleErrorResponse(error: any): void {
    // Handle 201 status as success (since that's the success status for this API)
    if (error.status === 201) {
      this.handleSuccessResponse();
      return;
    }

    let errorMessage = 'Business registration failed. Please try again.';

    if (error.status) {
      switch (error.status) {
        case 400:
          errorMessage = 'Invalid data provided. Please check your information and try again.';
          break;
        case 401:
          errorMessage = 'Authentication failed. Please log in and try again.';
          break;
        case 403:
          errorMessage = 'You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Service not found. Please contact support.';
          break;
        case 409:
          errorMessage = 'A business with this information already exists.';
          break;
        case 422:
          errorMessage = 'Data validation failed. Please check all required fields.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          errorMessage = 'Server error occurred. Please try again later or contact support.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Service temporarily unavailable. Please try again in a few minutes.';
          break;
        default:
          errorMessage = `Registration failed with status ${error.status}. Please try again.`;
      }
    }

    // Check for specific error messages from the API response
    if (error.error && error.error.message) {
      errorMessage = `Registration failed: ${error.error.message}`;
    } else if (error.error && typeof error.error === 'string') {
      errorMessage = `Registration failed: ${error.error}`;
    }

    this.message.error(errorMessage);
  }

  private showFinalSuccessModal(): void {
    this.modal.success({
      nzTitle: 'Registration Submitted Successfully!',
      nzContent: 'Your merchant registration has been created successfully. You will be notified once the review is complete.',
      nzOkText: 'Start New Registration',
      nzOnOk: () => {
        // Clear all form data and reset to step 1
        this.clearAllFormData();
        this.message.info('Form has been reset. You can start a new registration.');
      }
    });
  }

  private buildFinalPayload(): void {
    // Build addressInformation
    if (this.addressDetailsData?.addressDetails && this.addressDetailsData.addressDetails.length > 0) {
      const address = this.addressDetailsData.addressDetails[0];
      this.customerData.addressInformation = {
        streetAddress: address.streetAddress || address.addressLine1 || '',
        city: address.city || '',
        province: address.province || address.city || '',
        postalCode: address.postalCode || '',
        country: address.country || 'Zimbabwe',
        zimraBPNumber: this.businessDetailsData?.businessDetails?.basicInformation?.vatNumber || ''
      };
    }

    // Build businessDetails.basicInformation
    if (this.businessDetailsData?.businessDetails) {
      const bd = this.businessDetailsData.businessDetails;
      this.customerData.businessDetails.basicInformation = {
        registeredName: bd.basicInformation.registeredName || '',
        tradingName: bd.basicInformation.tradingName || '',
        registrationNumber: bd.basicInformation.registrationNumber || '',
        vatNumber: bd.basicInformation.vatNumber || ''
      };
    }

    // Build contactDetails
    if (this.contactDetailsData?.contactDetails) {
      const cd = this.contactDetailsData.contactDetails;
      this.customerData.contactDetails = {
        primaryContactPerson: cd.primaryContactPerson || cd.contactPersonName || '',
        emailAddress: cd.email || cd.emailAddress || '',
        mobileNumber: cd.phoneNumber || cd.mobileNumber || '',
        officePhoneNumber: cd.telephoneNumber || cd.officePhoneNumber || ''
      };
    }

    // Build directors
    if (this.directorsFormData?.directors) {
      this.customerData.directors = this.directorsFormData.directors.map((director: any) => {
        const pd = director.personalDetails || {};
        return {
          firstName: pd.firstName || pd.firstname || '',
          lastName: pd.lastName || pd.lastname || '',
          idNumber: pd.idNumber || pd.identification?.number || '',
          email: pd.email || director.contactDetails?.email || ''
        };
      });
    }

    // Build formsOfOwnership
    if (this.ownershipFormData?.ownershipDetails) {
      const od = this.ownershipFormData.ownershipDetails;
      this.customerData.formsOfOwnership = {
        ownershipType: od.ownershipType || od.typeOfOwnership || '',
        registrationDate: od.registrationDate || od.companyRegistrationDate || ''
      };
    }

    // Build merchantInformation
    if (this.merchantAccountData?.merchantAccount) {
      const ma = this.merchantAccountData.merchantAccount;
      this.customerData.merchantInformation = {
        merchantId: ma.merchantId || '',
        merchantCategoryCode: ma.merchantCategoryCode || ma.mcc || ''
      };
    }

    // Build preferences
    if (this.preferencesFormData?.preferences) {
      const prefs = this.preferencesFormData.preferences;
      this.customerData.preferences = {
        receiveNotifications: prefs.receiveNotifications !== false,
        notificationMethod: prefs.preferredCommMethod === 'Email' ? 'EMAIL' :
          prefs.preferredCommMethod === 'Phone Call' ? 'PHONE' : 'EMAIL'
      };
    }

    // Set metadata
    this.customerData.metadata = {
      createdBy: 'self-service-portal',
      sourceSystem: 'WebApp',
      timestamp: new Date().toISOString()
    };

  }

  submitOnboarding(): void {
    this.submitRegistration();
  }

  handleNextOrSubmit(): void {
    const isCaptchaStep = this.currentStep === 10;

    if (isCaptchaStep) {
      this.submitOnboarding();
    } else {
      this.goNext();
    }
  }

  getButtonText(): string {
    const isCaptchaStep = this.currentStep === 10;
    if (isCaptchaStep) {
      return 'Submit Registration';
    } else {
      return 'Next';
    }
  }
}