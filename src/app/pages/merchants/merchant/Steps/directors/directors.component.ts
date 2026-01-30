import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
// Removed Nz modules as they are replaced by custom HTML/CSS
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { countryCodes } from '../../../../shared/constants/countryCodes';
// Re-added for message service, assuming it's a global service or can be mocked
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-directors',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, // Keep FormsModule for ngModel binding in documents section
  ],
  templateUrl: './directors.component.html',
  styleUrls: ['./directors.component.scss']
})
export class DirectorsComponent implements OnInit {

  countryCodes: { [key: string]: string } = countryCodes;
  @Input() businessData: any = {};
  @Output() dataUpdated = new EventEmitter<any>();

  private authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNjk3MWRhYmUtN2FiMS00MTM5LThlYzQtOTQ0NjA0NGMyYmY3LyIsImlhdCI6MTc0NDAxODU2OCwibmJmIjoxNzQ0MDE4NTY4LCJleHAiOjE3NDQwMjI0NjgsImFpbyI6ImsyUmdZTERmeEM4a3ZEcFNhS2VZUFhkYzUwd0xBQT09IiwiYXBwaWQiOiJlMGYwNDk2Yi04Y2JjLTQwN2EtYjU5MS1iMzJjNGI2YmQ2NzYiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82OTcxZGFiZS03YWIxLTQxMzktOGVjNC05NDQ2MDQ0YzJiZjcvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiIxMDNmZTMyYy1mMWRmLTRiZWYtOWVmZS1hYzNhNmNjNDU4ZDMiLCJyaCI6IjEuQVFrQXZ0cHhhYkY2T1VHT3hKUkdCRXdyOTBaSWYza0F1dGRQdWtQYXdmajJNQk1KQUFBSkFBLiIsInN1YiI6IjEwM2ZlMzJjLWYxZGYtNGJlZi05ZWZlLWFjM2E2Y2M0NThkMyIsInRpZCI6IjY5NzFkYWJlLTdhYjEtNDEzOS04ZWM0LTk0NDYwNDRjMmJmNyIsInV0aSI6InNTTHdwRTdPTDB5eXFSRjVialNGQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfaWRyZWwiOiI3IDMyIiwieG1zX3RjZHQiOjE0MDM2MDQxMzZ9.VZkXcokT-Suzn0BhDYE40aA9hHDGfcSYpl8NSGoKhgT4b4G187hU_vyhYSNtbfZUaYD9_d2XYbGU8oYa5EbnC8fFd8XTWAfLO4v9E_d11as64vZEAAjJcsFG7DgscKMxpUD_sX0shUfrcBY-S44c10p3N85TfkWYwmSgv2gOSw3d5SIzgfmaJwCVKk0o4BGTV3OAn5i8z6TerOIPr2kShJpUHwR1x3os_GgkKMM0RU336o833nreZo_ykfvMLFSImzqIIiTx7K40IGY5YCq0bMRfwvTO9mzjCDwhyApghtxPcpqFU85lPpj_cKf_B2NQk9jqnWJ4Es1UlX5DIUPO9w';

  // Table and drawer state
  isDirectorDrawerVisible = false;
  directorsList: any[] = [];
  directorCurrentStep = 0;
  directorSteps = ['Personal Details', 'Address Details', 'Employment Details', 'Documents', 'Preferences'];

  // Form field options
  jobTitles: string[] = [
    'CEO',
    'Director',
    'Manager',
    'Supervisor',
    'Accountant',
    'Engineer',
    'Developer',
    'Analyst',
    'Administrator',
    'Consultant',
    'Other'
  ];
  documentCategories = [
    'PAYSLIP',
    'ZESA BILL',
    'APPLICATION FORM',
    'OTHERS'
  ];

  communicationMethods = [
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' },
    { value: 'phoneCall', label: 'Phone Call' }
  ];
  documentNames: { [key: string]: string[] } = {
    'PAYSLIP': ['Monthly Payslip', 'Annual Salary Certificate', 'Employment Letter'],
    'ZESA BILL': ['ZESA Bill', 'Electricity Bill', 'Utility Bill'],
    'APPLICATION FORM': ['Completed Application Form', 'Signed Application'],
    'OTHERS': ['ID Copy', 'Passport Copy', 'Proof of Residence', 'Bank Statement']
  };
  documentTypes = ['IMAGE', 'PDF', 'DOC', 'XLS'];

  // Document selections for upload
  documentSelections: {
    category: string;
    documentName: string;
    documentType: string;
    file: File | null;
    fileName: string;
    uploadDate: string | null;
    uploadStatus: 'pending' | 'uploaded' | 'later' | 'uploading' | 'error';
    sharepointUrl?: string;
  }[] = [];

  fileList: any[] = []; // This might not be needed with custom file input

  // Form groups
  directorsForm!: FormGroup; // This seems unused, consider removing if not needed
  directorForm!: FormGroup;
  preferencesForm!: FormGroup;

  // Track if we're editing an existing director
  isEditMode = false;
  currentDirectorIndex = -1;
  i: number | undefined;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService, // Keep this for messages
    private http: HttpClient
  ) { }

  ngOnInit() {
    // Initialize the forms
    this.initializeDirectorForm();
    this.initializePreferencesForm();

    // Initialize document selections
    this.documentSelections = this.documentCategories.map(category => ({
      category,
      documentName: '',
      documentType: '',
      file: null,
      fileName: '',
      uploadDate: null,
      uploadStatus: 'pending',
      sharepointUrl: ''
    }));

    // Load directors if available from business data
    if (this.businessData && this.businessData.directors && this.businessData.directors.length > 0) {
      this.directorsList = [...this.businessData.directors];
    }
  }

  private initializePreferencesForm(): void {
    this.preferencesForm = this.fb.group({
      preferredCommunicationMethod: [null],
      additionalEmail: ['', Validators.email],
      preferredReminderMethod: [null],
      additionalPhone: [''],
      additionalPhonePrefix: ['+263']
    });
  }

  // Add this method to your DirectorsComponent class
  isCurrentStepInvalid(): boolean {
    // This method needs to be aligned with the new UI and validation approach.
    // For now, it's a placeholder. You'll need to implement actual validation
    // based on the form controls' validity.
    switch (this.directorCurrentStep) {
      case 0: // Personal Details
        return !this.directorForm.get('title')?.valid ||
          !this.directorForm.get('firstName')?.valid ||
          !this.directorForm.get('lastName')?.valid ||
          !this.directorForm.get('identificationType')?.valid ||
          !this.directorForm.get('dateOfBirth')?.valid ||
          !this.directorForm.get('gender')?.valid ||
          (this.directorForm.get('identificationType')?.value === 'NATIONAL ID' && !this.directorForm.get('idNumber')?.valid) ||
          (this.directorForm.get('identificationType')?.value === 'PASSPORT' && !this.directorForm.get('passportNumber')?.valid);
      case 1: // Address Details
        return !this.directorForm.get('addressType')?.valid ||
          !this.directorForm.get('addressLine1')?.valid ||
          !this.directorForm.get('city')?.valid ||
          !this.directorForm.get('country')?.valid;
      case 2: // Employment Details
        return !this.directorForm.get('employerName')?.valid ||
          !this.directorForm.get('jobTitle')?.valid ||
          !this.directorForm.get('employmentYear')?.valid;
      case 3: // Documents
        // Check if at least one document is uploaded or marked for later
        const hasUploadedDocuments = this.documentSelections.some(doc =>
          doc.uploadStatus === 'uploaded' || doc.uploadStatus === 'later');
        return !hasUploadedDocuments;
      case 4: // Preferences
        return false; // Preferences are optional, so always allow next
      default:
        return true;
    }
  }

  private initializeDirectorForm(): void {
    this.directorForm = this.fb.group({
      // Personal Details
      title: [null, Validators.required],
      firstName: ['', Validators.required],
      middleName: [''], // Not required
      lastName: ['', Validators.required],
      identificationType: ['NATIONAL ID', Validators.required],
      idNumber: ['', Validators.required], // Initially required, validators updated by valueChanges
      email: ['', [Validators.email]],
      passportNumber: [''],
      countryCode: ['', Validators.required],
      // Initially not required, validators updated by valueChanges
      dateOfBirth: [null, Validators.required],
      gender: [null, Validators.required],
      citizenship: ['ZIMBABWE', Validators.required],
      nationality: ['ZIMBABWEAN', Validators.required],
      birthDistrict: ['', Validators.required],
      usaCitizen: ['NO', Validators.required],
      usaGreenCardHolder: ['NO', Validators.required],
      maritalStatus: [null, Validators.required],
      religion: [null, Validators.required],
      race: [null, Validators.required],
      mobileNumber: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      educationLevel: [null, Validators.required],
      dependants: [0, [Validators.min(0), Validators.max(20)]],

      // Address Details
      addressType: ['RESIDENTIAL', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''], // Not required
      streetNumber: [''], // Not required
      streetName: [''], // Not required
      suburb: [''], // Not required
      city: [null, Validators.required],
      country: ['ZIMBABWE', Validators.required],
      postalCode: [''],
      residenceYears: [0, [Validators.min(0), Validators.max(100)]],
      residenceMonths: [0, [Validators.min(0), Validators.max(11)]],
      ownershipType: [null, Validators.required],
      isSamePostalAddress: ['NO', Validators.required],

      // Employment Details
      employerName: ['', Validators.required],
      jobTitle: ['', Validators.required],
      employmentStatus: [''], // Not required
      employerContact: [''], // Not required
      employmentYear: [null, Validators.required],
      telephoneNumber: [''], // Added missing field
      employmentEmail: ['', Validators.email], // Added missing field, named differently to avoid conflict with personal email
      employerAddressLine1: [''], // Added missing field part 1
      employerAddressLine2: [''], // Added missing field part 2
      employerCity: [''], // Added missing field part 3
      employerCountry: [''], // Added missing field part 4
      industry: [''], // Added missing field
      industrySubCategory: [''] // Added missing field
    });

    // Dynamic validation based on identification type
    this.directorForm.get('identificationType')?.valueChanges.subscribe(type => {
      const nationalIdControl = this.directorForm.get('idNumber');
      const passportControl = this.directorForm.get('passportNumber');

      if (type === 'NATIONAL ID') {
        nationalIdControl?.setValidators([Validators.required, Validators.pattern(/^\d{2}-\d{6}-[A-Za-z]-\d{2}$/)]); // Example regex for Zimbabwean National ID
        passportControl?.clearValidators();
      } else {
        nationalIdControl?.clearValidators();
        passportControl?.setValidators([Validators.required]);
      }

      nationalIdControl?.updateValueAndValidity();
      passportControl?.updateValueAndValidity();
    });
  }

  getDocumentNamesByCategory(category: string): string[] {
    return this.documentNames[category as keyof typeof this.documentNames] || [];
  }

  // beforeUpload is not directly used with custom file input, but kept for reference
  beforeUpload = (file: any): boolean => {
    return true;
  };

  getCountries(): string[] {
    return Object.keys(this.countryCodes);
  }
  // SharePoint upload method - same as documents component
  private uploadFileToSharePoint(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('files', file);

      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
      });
      const folderName = 'business-documents';
      this.http.post<any>(
        'api/v1/sharepoint/upload-file?folderName=business-documents' + folderName,
        formData,
        { headers }
      ).subscribe({
        next: (response) => {
          // Assuming the response contains the SharePoint URL or you can construct it
          const documentUrl = `https://cbzco.sharepoint.com/sites/KaribuTech/Shared%20Documents/business-documents/${encodeURIComponent(file.name)}`;
          resolve(documentUrl);
        },
        error: (error) => reject(error)
      });
    });
  }

  // Updated file change handler with SharePoint upload
  async handleFileChange(event: Event, index: number): Promise<void> {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      // Update status to uploading
      this.documentSelections[index].file = file;
      this.documentSelections[index].fileName = file.name;
      this.documentSelections[index].uploadStatus = 'uploading';
      this.message.info(`Uploading ${file.name}...`);

      try {
        // Upload to SharePoint
        const sharepointUrl = await this.uploadFileToSharePoint(file);

        // Update status to uploaded
        this.documentSelections[index].uploadStatus = 'uploaded';
        this.documentSelections[index].uploadDate = new Date().toISOString();
        this.documentSelections[index].sharepointUrl = sharepointUrl;

        this.message.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        this.documentSelections[index].uploadStatus = 'error';
        this.message.error(`Failed to upload ${file.name}`);
        console.error('Upload error:', error);
      }
    }
  }

  uploadLater(category: string, index: number): void {
    this.documentSelections[index].uploadStatus = 'later';
    this.documentSelections[index].fileName = 'Will upload later';
    this.documentSelections[index].file = null;
    this.message.warning(`You selected to upload ${category} later`);
  }

  previewDocument(index: number): void {
    const document = this.documentSelections[index];
    if (document.file) {
      // In a real app, you would implement actual preview logic here
      this.message.info(`Previewing ${document.fileName}`);
      // For actual preview, you could use:
      // const fileUrl = URL.createObjectURL(document.file);
      // window.open(fileUrl, '_blank');
    } else if (document.sharepointUrl) {
      window.open(document.sharepointUrl, '_blank');
    }
  }

  addDirector(directorData: any): void {
    const transformedData = this.transformDirectorData(directorData);

    if (this.isEditMode && this.currentDirectorIndex !== -1) {
      this.directorsList[this.currentDirectorIndex] = transformedData;
    } else {
      this.directorsList = [...this.directorsList, transformedData];
    }


    // FIX: Ensure the emission format matches what the parent expects
    this.dataUpdated.emit({
      directors: this.directorsList,
      isValid: this.directorsList.length > 0
    });

    // Close drawer and show message
    this.closeDirectorDrawer();
    this.message.success(
      this.isEditMode ? 'Director updated successfully' : 'Director added successfully'
    );

    // Reset edit mode
    this.isEditMode = false;
    this.currentDirectorIndex = -1;
  }

  editDirector(director: any, index: number): void {
    this.isEditMode = true;
    this.currentDirectorIndex = index;

    // Reset forms
    this.directorForm.reset({
      citizenship: 'ZIMBABWE',
      nationality: 'ZIMBABWEAN',
      usaCitizen: 'NO',
      usaGreenCardHolder: 'NO',
      dependants: 0,
      addressType: 'RESIDENTIAL',
      country: 'ZIMBABWE',
      residenceYears: 0,
      residenceMonths: 0,
      isSamePostalAddress: 'NO',
      identificationType: 'NATIONAL ID' // Default to National ID for editing
    });
    this.preferencesForm.reset({
      additionalPhonePrefix: '+263'
    });

    // Set the form values based on the selected director
    this.directorForm.patchValue({
      // Personal Details
      title: director.personalDetails.title,
      firstName: director.personalDetails.firstName,
      middleName: director.personalDetails.middleName,
      lastName: director.personalDetails.lastName,
      identificationType: director.personalDetails.identification.type,
      idNumber: director.personalDetails.identification.type === 'NATIONAL ID' ? director.personalDetails.identification.number : '',
      passportNumber: director.personalDetails.identification.type === 'PASSPORT' ? director.personalDetails.identification.number : '',
      dateOfBirth: director.personalDetails.dateOfBirth,
      gender: director.personalDetails.gender,
      citizenship: director.personalDetails.citizenship,
      nationality: director.personalDetails.nationality,
      birthDistrict: director.personalDetails.birthDistrict,
      usaCitizen: director.personalDetails.usaStatus.isCitizen ? 'YES' : 'NO',
      usaGreenCardHolder: director.personalDetails.usaStatus.hasGreenCard ? 'YES' : 'NO',
      email: director.personalDetails.email,
      maritalStatus: director.personalDetails.maritalStatus,
      religion: director.personalDetails.religion,
      race: director.personalDetails.race,
      mobileNumber: director.personalDetails.mobileNumber,
      phoneNumber: director.personalDetails.phoneNumber,
      educationLevel: director.personalDetails.educationLevel,
      dependants: director.personalDetails.numberOfDependants,

      // Address Details
      addressType: director.addressDetails.type,
      addressLine1: director.addressDetails.addressLine1,
      addressLine2: director.addressDetails.addressLine2,
      streetNumber: director.addressDetails.streetNumber,
      streetName: director.addressDetails.streetName,
      suburb: director.addressDetails.suburb,
      city: director.addressDetails.city,
      country: director.addressDetails.country,
      postalCode: director.addressDetails.postalCode,
      residenceYears: director.addressDetails.residenceDuration.years,
      residenceMonths: director.addressDetails.residenceDuration.months,
      ownershipType: director.addressDetails.ownershipType,
      isSamePostalAddress: director.addressDetails.isSameAsPostalAddress ? 'YES' : 'NO',
    })

    // Employment Details
    this.directorForm.patchValue({
      employerName: director.employmentDetails.employerName || '',
      jobTitle: director.employmentDetails.jobTitle || '',
      employmentStatus: director.employmentDetails.employmentStatus || '',
      employerContact: director.employmentDetails.employerContact || '',
      employmentYear: director.employmentDetails.employmentYear || '',
      telephoneNumber: director.employmentDetails.telephoneNumber || '', // New
      employmentEmail: director.employmentDetails.email || '', // New (using 'employmentEmail' to avoid conflict)
      employerAddressLine1: director.employmentDetails.address?.addressLine1 || '', // New
      employerAddressLine2: director.employmentDetails.address?.addressLine2 || '', // New
      employerCity: director.employmentDetails.address?.city || '', // New
      employerCountry: director.employmentDetails.address?.country || '', // New
      industry: director.employmentDetails.industry || '', // New
      industrySubCategory: director.employmentDetails.industrySubCategory || '' // New
    });

    // Handle documents if needed
    if (director.documents && director.documents.length > 0) {
      // Reset document selections
      this.documentSelections = this.documentCategories.map(category => ({
        category,
        documentName: '',
        documentType: '',
        file: null,
        fileName: '',
        uploadDate: null,
        uploadStatus: 'pending' as 'pending' | 'uploaded' | 'later' | 'uploading' | 'error',
        sharepointUrl: ''
      }));

      // Populate document selections from director data
      director.documents.forEach((doc: any) => {
        const index = this.documentSelections.findIndex(item => item.category === doc.category);
        if (index !== -1) {
          this.documentSelections[index] = {
            ...this.documentSelections[index],
            documentType: doc.type,
            fileName: doc.fileName,
            uploadDate: doc.uploadDate,
            uploadStatus: 'uploaded',
            sharepointUrl: doc.sharepointUrl || ''
          };
        }
      });
    }

    // Handle preferences if needed
    if (director.preferences) {
      this.preferencesForm.patchValue({
        preferredCommunicationMethod: director.preferences.preferredCommunicationMethod,
        additionalEmail: director.preferences.additionalEmail,
        preferredReminderMethod: director.preferences.preferredReminderMethod,
        additionalPhone: director.preferences.additionalPhone?.substring(4), // Remove country code
        additionalPhonePrefix: director.preferences.additionalPhone?.substring(0, 4) || '+263' // Extract country code
      });
    }

    // Open the drawer in edit mode
    this.isDirectorDrawerVisible = true;
    this.directorCurrentStep = 0;
  }

  updateBusinessData(data: any): void {
    this.businessData = {
      ...this.businessData,
      ...data,
      // Explicitly handle directors if needed
      directors: data.directors || this.businessData.directors
    };
  }

  removeDirector(director: any): void {
    const index = this.directorsList.findIndex(d =>
      d.personalDetails.identification.number === director.personalDetails.identification.number
    );

    if (index !== -1) {
      this.directorsList = [
        ...this.directorsList.slice(0, index),
        ...this.directorsList.slice(index + 1)
      ];

      // FIX: Ensure proper emission format
      this.dataUpdated.emit({
        directors: this.directorsList,
        isValid: this.directorsList.length > 0
      });
      this.message.success('Director removed successfully');
    }
  }

  // Drawer methods
  showDirectorDrawer(): void {
    this.isEditMode = false;
    this.currentDirectorIndex = -1;
    this.isDirectorDrawerVisible = true;
    this.directorCurrentStep = 0;

    // Reset forms
    this.directorForm.reset({
      citizenship: 'ZIMBABWE',
      nationality: 'ZIMBABWEAN',
      usaCitizen: 'NO',
      usaGreenCardHolder: 'NO',
      dependants: 0,
      addressType: 'RESIDENTIAL',
      country: 'ZIMBABWE',
      residenceYears: 0,
      residenceMonths: 0,
      isSamePostalAddress: 'NO',
      identificationType: 'NATIONAL ID'
    });

    this.preferencesForm.reset({
      additionalPhonePrefix: '+263'
    });

    // Reset document selections
    this.documentSelections = this.documentCategories.map(category => ({
      category,
      documentName: '',
      documentType: '',
      file: null,
      fileName: '',
      uploadDate: null,
      uploadStatus: 'pending',
      sharepointUrl: ''
    }));
  }

  closeDirectorDrawer(): void {
    this.isDirectorDrawerVisible = false;
    this.isEditMode = false;
    this.currentDirectorIndex = -1;
  }

  // Step navigation methods
  onDirectorStepChange(index: number): void {
    // Only allow navigation to previous steps or the current step
    if (index <= this.directorCurrentStep) {
      this.directorCurrentStep = index;
    }
  }

  nextDirectorStep(): void {
    // Mark all fields as touched to show validation errors for the current step
    this.markCurrentStepFieldsAsTouched();

    // Only proceed if current step is valid
    if (!this.isCurrentStepInvalid()) {
      this.directorCurrentStep++;
    } else {
      this.message.error('Please fill in all required fields for the current step.');
    }
  }

  private markCurrentStepFieldsAsTouched(): void {
    switch (this.directorCurrentStep) {
      case 0: // Personal Details
        this.markFormGroupFieldsAsTouched(this.directorForm, [
          'title', 'firstName', 'lastName', 'identificationType',
          'dateOfBirth', 'gender', 'idNumber', 'passportNumber',
          'citizenship', 'nationality', 'birthDistrict', 'usaCitizen',
          'usaGreenCardHolder', 'maritalStatus', 'religion', 'race', 'email',
          'mobileNumber', 'phoneNumber', 'educationLevel', 'dependants'
        ]);
        break;

      case 1: // Address Details
        this.markFormGroupFieldsAsTouched(this.directorForm, [
          'addressType', 'addressLine1', 'addressLine2', 'streetNumber',
          'streetName', 'suburb', 'city', 'country', 'postalCode',
          'residenceYears', 'residenceMonths', 'ownershipType', 'isSamePostalAddress'
        ]);
        break;

      case 2: // Employment Details
        this.markFormGroupFieldsAsTouched(this.directorForm, [
          'employerName', 'jobTitle', 'employmentStatus', 'employerContact', 'employmentYear',
          'telephoneNumber', 'employmentEmail', 'employerAddressLine1', 'employerAddressLine2',
          'employerCity', 'employerCountry', 'industry', 'industrySubCategory'
        ]);
        break;
      case 3: // Documents - No form group, manual check for document status
        // No form fields to mark touched, validation is handled by hasUploadedDocuments
        break;
      case 4: // Preferences
        this.markFormGroupFieldsAsTouched(this.preferencesForm, [
          'preferredCommunicationMethod', 'additionalEmail', 'preferredReminderMethod',
          'additionalPhone', 'additionalPhonePrefix'
        ]);
        break;
    }
  }

  private markFormGroupFieldsAsTouched(formGroup: FormGroup, fields: string[]): void {
    fields.forEach(field => {
      const control = formGroup.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  prevDirectorStep(): void {
    if (this.directorCurrentStep > 0) {
      this.directorCurrentStep--;
    }
  }

  // Transform the form data for API submission
  private transformDirectorData(formData: any): any {

    return {
      personalDetails: {
        title: formData.title,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        identification: {
          type: formData.identificationType,
          number: formData.identificationType === 'NATIONAL ID' ?
            formData.idNumber : formData.passportNumber // Use idNumber or passportNumber based on type
        },
        idNumber: formData.idNumber, // Keep for backward compatibility if needed, but 'identification.number' is preferred
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        citizenship: formData.citizenship,
        nationality: formData.nationality,
        birthDistrict: formData.birthDistrict,
        usaStatus: {
          isCitizen: formData.usaCitizen === 'YES',
          hasGreenCard: formData.usaGreenCardHolder === 'YES'
        },
        email: formData.email,
        maritalStatus: formData.maritalStatus,
        religion: formData.religion,
        race: formData.race,
        mobileNumber: formData.mobileNumber,
        phoneNumber: formData.phoneNumber,
        educationLevel: formData.educationLevel,
        numberOfDependants: formData.dependants
      },
      addressDetails: {
        type: formData.addressType,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        streetNumber: formData.streetNumber,
        streetName: formData.streetName,
        suburb: formData.suburb,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
        residenceDuration: {
          years: formData.residenceYears,
          months: formData.residenceMonths
        },
        ownershipType: formData.ownershipType,
        isSameAsPostalAddress: formData.isSamePostalAddress === 'YES'
      },
      employmentDetails: {
        employerName: formData.employerName || '',
        jobTitle: formData.jobTitle || '',
        employmentStatus: formData.employmentStatus || '',
        employerContact: formData.employerContact || '',
        employmentYear: formData.employmentYear || '',
        telephoneNumber: formData.telephoneNumber || '',
        employmentEmail: formData.employmentEmail || '',
        address: { // Nested address object for employment details
          addressLine1: formData.employerAddressLine1 || '',
          addressLine2: formData.employerAddressLine2 || '',
          city: formData.employerCity || '',
          country: formData.employerCountry || ''
        },
        industry: formData.industry || '',
        industrySubCategory: formData.industrySubCategory || ''
      },
      documents: this.documentSelections
        .filter(doc => doc.uploadStatus === 'uploaded')
        .map(doc => ({
          category: doc.category,
          documentName: doc.documentName, // Ensure documentName is included
          type: doc.documentType,
          fileName: doc.fileName,
          uploadDate: doc.uploadDate,
          sharepointUrl: doc.sharepointUrl,
          status: 'uploaded'
        })),
      preferences: {
        preferredCommunicationMethod: formData.preferredCommunicationMethod,
        additionalEmail: formData.additionalEmail,
        preferredReminderMethod: formData.preferredReminderMethod,
        additionalPhone: formData.additionalPhonePrefix + formData.additionalPhone
      }
    };
  }

  // Form submission
  submitDirector(): void {
    // Mark all fields as touched to show validation errors for the final step
    this.markFormGroupTouched(this.directorForm);
    this.markFormGroupTouched(this.preferencesForm);

    if (this.isCurrentStepInvalid()) {
      this.message.error('Please fill in all required fields before submitting.');
      return;
    }

    try {
      // Combine form data
      const formData = {
        ...this.directorForm.value,
        ...this.preferencesForm.value,
        documents: this.documentSelections // Pass documentSelections directly for transformation
      };

      // Log the raw form data before transformation

      // Transform the data for API submission
      const transformedData = this.transformDirectorData(formData);

      // Log the transformed data

      // Add or update director
      this.addDirector(formData); // Pass original formData to addDirector as it expects it

      // Close the drawer
      this.closeDirectorDrawer();

      this.message.success(
        this.isEditMode ? 'Director updated successfully' : 'Director added successfully'
      );
    } catch (error) {
      console.error('Error submitting director:', error);
      this.message.error('An error occurred while saving director');
    }
  }

  trackByDirectorId(index: number, director: any): string {
    return director.personalDetails.identification.number;
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper method to get step icon
  getStepIcon(step: string): string {
    switch (step) {
      case 'Personal Details': return 'user';
      case 'Address Details': return 'home';
      case 'Employment Details': return 'briefcase'; // Changed from solution to briefcase for better icon
      case 'Documents': return 'file-alt'; // Changed from file to file-alt for better icon
      case 'Preferences': return 'cogs'; // Changed from setting to cogs for better icon
      default: return '';
    }
  }
}