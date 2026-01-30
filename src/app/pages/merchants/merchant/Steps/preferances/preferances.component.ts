import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// Import NG-Zorro modules
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

@Component({
  selector: 'app-preferances',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
  ],
  templateUrl: './preferances.component.html',
  styleUrl: './preferances.component.css'
})
export class PreferancesComponent implements OnInit {
  @Input() preferencesData: any = {}; // Changed input name for clarity
  @Output() formData = new EventEmitter<any>();

  preferencesForm!: FormGroup;

  countryCodes = [
    { name: 'Zimbabwe', dial_code: '+263' },
    { name: 'South Africa', dial_code: '+27' },
    { name: 'United States', dial_code: '+1' },
    { name: 'United Kingdom', dial_code: '+44' },
    { name: 'Canada', dial_code: '+1' }
  ];

  communicationMethods = [
    { value: 'Email', label: 'Email' }, // Changed values to match example API output
    { value: 'Phone Call', label: 'Phone Call' },
    { value: 'SMS', label: 'SMS' },
    { value: 'WhatsApp', label: 'WhatsApp' }
  ];

  reminderMethods = [ // Added reminder methods as per parent's transform
    { value: 'Email', label: 'Email' },
    { value: 'Phone Call', label: 'Phone Call' },
    { value: 'SMS', label: 'SMS' }
  ];
  languagesList = [
    { value: 'English', label: 'English' },
    { value: 'Shona', label: 'Shona' },
    { value: 'Ndebele', label: 'Ndebele' },
    { value: 'Other', label: 'Other' }
  ];

  hobbiesList = [
    { value: 'Sports', label: 'Sports' },
    { value: 'Reading', label: 'Reading' },
    { value: 'Music', label: 'Music' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Cooking', label: 'Cooking' },
    { value: 'Other', label: 'Other' }
  ];





  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
    this.setupFormChanges();

    // Emit initial data if pre-populated or default
    if (this.preferencesData && Object.keys(this.preferencesData).length > 0) {
      this.preferencesForm.patchValue({
        preferredCommMethod: this.preferencesData.preferredCommMethod || 'Email',
        preferredCommMethodForReminders: this.preferencesData.preferredCommMethodForReminders || 'Phone Call',
        languages: this.preferencesData.languages || ['English'],
        hobbies: this.preferencesData.hobbies || []
      });
      setTimeout(() => this.emitFormData(), 100);
    } else {
      setTimeout(() => this.emitFormData(), 100); // Emit default initial state
    }
  }

  private initializeForm(): void {
    this.preferencesForm = this.fb.group({
      preferredCommMethod: ['Email', Validators.required],
      preferredCommMethodForReminders: ['Phone Call', Validators.required],
      languages: [[], Validators.required], // Initialize as array
      hobbies: [[], Validators.required],   // Initialize as array
      additionalEmail: [''],
      additionalPhone: [''],
      additionalPhonePrefix: ['+263']
    });
  }

  private setupFormChanges(): void {
    this.preferencesForm.valueChanges.subscribe(() => {
      this.emitFormData();
    });
  }

  private emitFormData(): void {
    const formValue = this.preferencesForm.value;

    const dataToEmit = {
      preferences: {
        preferredCommMethod: formValue.preferredCommMethod,
        preferredCommMethodForReminders: formValue.preferredCommMethodForReminders,
        languages: formValue.languages || [],
        hobbies: formValue.hobbies || [],
        additionalEmail: formValue.additionalEmail,
        additionalPhone: formValue.additionalPhone ?
          `${formValue.additionalPhonePrefix}${formValue.additionalPhone}` : ''
      },
      isValid: this.preferencesForm.valid
    };

    this.formData.emit(dataToEmit);
  }

  // Optional: A submit method if you have a submit button within this component
  onSubmit(): void {
    if (this.preferencesForm.valid) {
      this.emitFormData();
      // Optionally show a success message
    } else {
      this.preferencesForm.markAllAsTouched();
      this.emitFormData(); // Emit invalid state
      // Optionally show an error message
    }
  }
}
