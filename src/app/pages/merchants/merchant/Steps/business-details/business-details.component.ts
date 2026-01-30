import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { countries } from '../../../../shared/constants/countries';
import { countryCodes } from '../../../../shared/constants/countryCodes';
@Component({
    selector: 'app-business-details',
    templateUrl: './business-details.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule
    ],
    styleUrls: ['./business-details.component.css']
})
export class BusinessDetailsComponent implements OnInit {

    public Object = Object;

    public countryCodes = countryCodes;
    public countries = Object.keys(this.countryCodes) as (keyof typeof countryCodes)[];



    @Input() businessData: any = {};
    @Output() formData = new EventEmitter<any>();

    businessForm!: FormGroup;
    formSubmitted = false;

    // Industry subcategories mapping
    industrySubCategories: { [key: string]: { value: string; label: string }[] } = {
        agriculture: [
            { value: 'crop-farming', label: 'Crop Farming' },
            { value: 'livestock', label: 'Livestock' },
            { value: 'forestry', label: 'Forestry' },
            { value: 'fishing', label: 'Fishing' }
        ],
        manufacturing: [
            { value: 'food-processing', label: 'Food Processing' },
            { value: 'textiles', label: 'Textiles' },
            { value: 'chemicals', label: 'Chemicals' },
            { value: 'machinery', label: 'Machinery' }
        ],
        retail: [
            { value: 'general-retail', label: 'General Retail' },
            { value: 'automotive', label: 'Automotive' },
            { value: 'electronics', label: 'Electronics' },
            { value: 'clothing', label: 'Clothing' }
        ],
        services: [
            { value: 'professional-services', label: 'Professional Services' },
            { value: 'consulting', label: 'Consulting' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'logistics', label: 'Logistics' }
        ],
        technology: [
            { value: 'software-development', label: 'Software Development' },
            { value: 'it-services', label: 'IT Services' },
            { value: 'telecommunications', label: 'Telecommunications' },
            { value: 'hardware', label: 'Hardware' }
        ],
        healthcare: [
            { value: 'medical-services', label: 'Medical Services' },
            { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
            { value: 'medical-equipment', label: 'Medical Equipment' },
            { value: 'wellness', label: 'Wellness' }
        ],
        education: [
            { value: 'primary-education', label: 'Primary Education' },
            { value: 'secondary-education', label: 'Secondary Education' },
            { value: 'higher-education', label: 'Higher Education' },
            { value: 'vocational-training', label: 'Vocational Training' }
        ],
        finance: [
            { value: 'banking', label: 'Banking' },
            { value: 'insurance', label: 'Insurance' },
            { value: 'investment', label: 'Investment' },
            { value: 'accounting', label: 'Accounting' }
        ],
        construction: [
            { value: 'residential', label: 'Residential Construction' },
            { value: 'commercial', label: 'Commercial Construction' },
            { value: 'infrastructure', label: 'Infrastructure' },
            { value: 'renovation', label: 'Renovation' }
        ],
        other: [
            { value: 'other-category', label: 'Other Category' }
        ]
    };

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.initializeForm();
        this.setupFormChanges();
        this.setupIndustryChange();
    }

    private initializeForm(): void {
        this.businessForm = this.fb.group({
            registeredName: ['', Validators.required],
            tradingName: ['', Validators.required],
            vatNumber: ['', Validators.required],
            countryOfIncorporation: ['', Validators.required],
            certificateOfIncorporationNumber: ['', Validators.required],
            registrationDate: ['', Validators.required],
            ownershipType: ['', Validators.required],
            industry: ['', Validators.required],
            industrySubCategory: ['', Validators.required],
            primaryContactPerson: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            mobilePrefix: ['+263'],
            mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
            officePhoneNumber: ['', Validators.required],
            fax: ['', Validators.required],
            companyDescription: ['', [Validators.required, Validators.minLength(10)]]
        });

        if (this.businessData && Object.keys(this.businessData).length > 0) {
            this.businessForm.patchValue(this.businessData);
        }
    }

    private setupFormChanges(): void {
        this.businessForm.valueChanges.subscribe(() => {
            if (this.businessForm.touched) {
                this.emitFormData();
            }
        });

        this.businessForm.statusChanges.subscribe(() => {
            if (this.businessForm.touched) {
                this.emitFormData();
            }
        });
    }

    private setupIndustryChange(): void {
        this.businessForm.get('industry')?.valueChanges.subscribe(industry => {
            const subCategoryControl = this.businessForm.get('industrySubCategory');
            if (subCategoryControl) {
                subCategoryControl.setValue('');
                subCategoryControl.markAsUntouched();
            }
        });
    }

    private emitFormData(): void {
        const formValue = this.businessForm.value;
        const formattedData = {
            businessDetails: {
                basicInformation: {
                    registeredName: formValue.registeredName,
                    tradingName: formValue.tradingName,
                    vatNumber: formValue.vatNumber,
                    countryOfIncorporation: formValue.countryOfIncorporation,
                    registrationNumber: formValue.certificateOfIncorporationNumber,
                },
                industryInformation: {
                    industry: formValue.industry,
                    industrySubCategory: formValue.industrySubCategory,
                },
                companyDescription: formValue.companyDescription,
            },
            contactDetails: {
                primaryContactPerson: formValue.primaryContactPerson,
                emailAddress: formValue.email,
                mobileNumber: `${formValue.mobilePrefix}${formValue.mobileNumber}`,
                officePhoneNumber: formValue.officePhoneNumber,
            },
            formsOfOwnership: {
                ownershipType: formValue.ownershipType,
                registrationDate: this.formatDate(formValue.registrationDate),
            },
            isValid: this.businessForm.valid,
            isTouched: this.businessForm.touched,
            formErrors: this.getFormErrors(),
        };

        this.formData.emit(formattedData);
    }

    private formatDate(date: any): string {
        if (!date) return '';

        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        }

        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date;
        }

        return date.toString();
    }

    private getFormErrors(): any {
        const errors: any = {};
        this.Object.keys(this.businessForm.controls).forEach(key => {
            const control = this.businessForm.get(key);
            if (control?.errors && control?.touched) {
                errors[key] = control.errors;
            }
        });
        return errors;
    }

    getSubCategories(): { value: string; label: string }[] {
        const selectedIndustry = this.businessForm.get('industry')?.value;
        return selectedIndustry && this.industrySubCategories[selectedIndustry]
            ? this.industrySubCategories[selectedIndustry]
            : [];
    }

    hasFieldError(fieldName: string): boolean {
        const field = this.businessForm.get(fieldName);
        return !!(field?.errors && field?.touched);
    }

    getFieldError(fieldName: string): string {
        const field = this.businessForm.get(fieldName);
        if (!field?.errors || !field?.touched) return '';

        if (field.errors['required']) {
            return `${this.getFieldLabel(fieldName)} is required`;
        }
        if (field.errors['email']) {
            return 'Please enter a valid email address';
        }
        if (field.errors['pattern']) {
            return 'Please enter a valid phone number (numbers only)';
        }
        if (field.errors['minlength']) {
            return `Minimum ${field.errors['minlength'].requiredLength} characters required`;
        }

        return 'Invalid input';
    }

    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            registeredName: 'Registered Name',
            tradingName: 'Trading Name',
            countryOfIncorporation: 'Country of Incorporation',
            certificateOfIncorporationNumber: 'Certificate of Incorporation Number',
            vatNumber: 'VAT Number',
            registrationDate: 'Registration Date',
            ownershipType: 'Form of Ownership',
            industry: 'Industry',
            industrySubCategory: 'Industry Sub Category',
            primaryContactPerson: 'Primary Contact Person',
            email: 'Email',
            mobileNumber: 'Mobile Number',
            officePhoneNumber: 'Office Phone Number',
            fax: 'Fax',
            companyDescription: 'Company Description'
        };
        return labels[fieldName] || fieldName;
    }

    onFieldBlur(fieldName?: string): void {
        if (fieldName) {
            this.businessForm.get(fieldName)?.markAsTouched();
        } else {
            this.businessForm.markAllAsTouched();
        }

        this.emitFormData();
    }

    validateForm(): boolean {
        this.formSubmitted = true;
        this.businessForm.markAllAsTouched();
        this.emitFormData();
        return this.businessForm.valid;
    }

    resetForm(): void {
        this.formSubmitted = false;
        this.businessForm.reset();
        this.businessForm.patchValue({
            mobilePrefix: '+263'
        });
    }
}