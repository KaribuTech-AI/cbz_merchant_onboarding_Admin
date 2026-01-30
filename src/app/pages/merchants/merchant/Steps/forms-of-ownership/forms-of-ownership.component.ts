import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, AbstractControl } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form'; // Ensure NzFormModule is imported

@Component({
  selector: 'app-forms-of-ownership',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    NzFormModule // This is crucial for nzErrorTip to be recognized
  ],
  templateUrl: './forms-of-ownership.component.html',
  styleUrls: ['./forms-of-ownership.component.css']
})
export class FormsOfOwnershipComponent implements OnInit {
  @Input() ownershipData: any = {};
  @Output() formData = new EventEmitter<any>();
  ownershipForm!: FormGroup;

  companyTypes: string[] = [
    'Sole Proprietorship',
    'Partnership',
    'Private Limited Company',
    'Public Limited Company',
    'Cooperative',
    'Non-Profit Organization'
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();

    if (this.ownershipData && Object.keys(this.ownershipData).length > 0) {
      const { companyType, registrationNumber, noOfEmployees, shareholders } = this.ownershipData;

      this.ownershipForm.patchValue({
        companyType: companyType || '',
        registrationNumber: registrationNumber || '',
        numberOfEmployees: noOfEmployees ?? null // Use null for number input if no value
      });

      const currentShareholders = this.shareholdersArray;
      while (currentShareholders.length !== 0) {
        currentShareholders.removeAt(0);
      }
      if (shareholders && shareholders.length > 0) {
        shareholders.forEach((owner: any) => currentShareholders.push(this.createShareholderFormGroup(owner)));
      } else {
        currentShareholders.push(this.createShareholderFormGroup());
      }
    } else {
      if (this.shareholdersArray.length === 0) {
        this.shareholdersArray.push(this.createShareholderFormGroup());
      }
    }

    this.setupFormChanges();
    this.emitFormData();
  }

  private initializeForm(): void {
    const companyType = this.ownershipData?.companyType || '';
    const registrationNumber = this.ownershipData?.registrationNumber || '';
    // Initialize as null or 0 for a number input
    const noOfEmployees = this.ownershipData?.noOfEmployees ?? null;
    const shareholders = this.ownershipData?.shareholders || [];

    this.ownershipForm = this.fb.group({
      companyType: [companyType, Validators.required],
      registrationNumber: [registrationNumber, Validators.required],
      numberOfEmployees: [noOfEmployees, [Validators.required, Validators.min(1)]], // Ensure it's treated as a number
      shareholders: this.fb.array(
        shareholders.length > 0
          ? shareholders.map((s: any) => this.createShareholderFormGroup(s))
          : []
      )
    });
  }

  private createShareholderFormGroup(
    owner?: { id?: number, firstname: string, middlename?: string, lastname: string, percentage: number }
  ): FormGroup {
    return this.fb.group({
      id: [owner?.id || Math.floor(Math.random() * 10000000000)],
      firstname: [owner?.firstname || '', Validators.required],
      middlename: [owner?.middlename || ''],
      lastname: [owner?.lastname || '', Validators.required],
      percentage: [owner?.percentage || 0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  private setupFormChanges(): void {
    this.ownershipForm.valueChanges.subscribe(() => {
      this.emitFormData();
    });
  }

  private emitFormData(): void {
    const formValue = this.ownershipForm.value;

    const totalPercentage = formValue.shareholders.reduce((sum: number, owner: any) => sum + (owner.percentage || 0), 0);
    const isShareholderPercentageValid = totalPercentage === 100;

    const ownershipData = {
      companyType: formValue.companyType,
      registrationNumber: formValue.registrationNumber,
      noOfEmployees: formValue.numberOfEmployees, // This will now be a number
      shareholders: formValue.shareholders.map((owner: any) => ({
        id: owner.id,
        firstname: owner.firstname,
        middlename: owner.middlename,
        lastname: owner.lastname,
        percentage: owner.percentage
      }))
    };

    const isValid = this.ownershipForm.valid && isShareholderPercentageValid;

    this.formData.emit({ ownershipDetails: ownershipData, isValid: isValid });
  }

  get shareholdersArray(): FormArray {
    return this.ownershipForm.get('shareholders') as FormArray;
  }

  addShareholderRow() {
    this.shareholdersArray.push(this.createShareholderFormGroup());
    this.emitFormData();
  }

  deleteShareholderRow(index: number) {
    if (this.shareholdersArray.length > 1) {
      this.shareholdersArray.removeAt(index);
      this.emitFormData();
    }
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getShareholderPercentageError(): string | null {
    if (!this.ownershipForm || !this.shareholdersArray) {
      return null;
    }
    const totalPercentage = this.shareholdersArray.controls.reduce((sum, control) => sum + (control.get('percentage')?.value || 0), 0);

    if (this.shareholdersArray.touched && totalPercentage !== 100) {
      return `Total shareholder percentage must be 100%. Current: ${totalPercentage}%`;
    }
    return null;
  }

  public isControlInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  public getFieldErrorMessage(control: AbstractControl | null, fieldName: string): string {
    if (this.isControlInvalid(control)) {
      if (control?.errors?.['required']) {
        return `${this.formatFieldName(fieldName)} is required`;
      }
      if (control?.errors?.['min']) {
        return `${this.formatFieldName(fieldName)} must be at least ${control.errors['min'].min}`;
      }
      if (control?.errors?.['max']) {
        return `${this.formatFieldName(fieldName)} cannot exceed ${control.errors['max'].max}`;
      }
    }
    return '';
  }

  // Add this method to your FormsOfOwnershipComponent class
  isAddOwnerButtonDisabled(): boolean {
    const totalPercentage = this.shareholdersArray.controls.reduce(
      (sum, control) => sum + (control.get('percentage')?.value || 0),
      0
    );
    return totalPercentage >= 100;
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
}
