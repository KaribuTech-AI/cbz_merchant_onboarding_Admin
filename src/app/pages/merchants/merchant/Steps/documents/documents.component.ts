import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface DocumentSelection {
  category: string;
  documentName: string;
  documentType: string;
  fileName: string;
  file: File | null;
  uploadStatus: 'pending' | 'uploading' | 'success' | 'error' | '';
  sharepointUrl?: string;
}

interface DocumentData {
  id: string;
  category: string;
  type: string;
  name: string;
  file: File | null;
  url: string;
  expiryDate: string;
  uploadDate: string;
  status: 'uploaded' | 'pending';
  uploadStatus: string;
}
@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzUploadModule
  ],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {
  @Input() businessData: any = {};
  @Output() documentsUpdated = new EventEmitter<any>();
  @Output() dataUpdated = new EventEmitter<any>();

  private authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSIsImtpZCI6IkNOdjBPSTNSd3FsSEZFVm5hb01Bc2hDSDJYRSJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvNjk3MWRhYmUtN2FiMS00MTM5LThlYzQtOTQ0NjA0NGMyYmY3LyIsImlhdCI6MTc0NDAxODU2OCwibmJmIjoxNzQ0MDE4NTY4LCJleHAiOjE3NDQwMjI0NjgsImFpbyI6ImsyUmdZTERmeEM4a3ZEcFNhS2VZUFhkYzUwd0xBQT09IiwiYXBwaWQiOiJlMGYwNDk2Yi04Y2JjLTQwN2EtYjU5MS1iMzJjNGI2YmQ2NzYiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC82OTcxZGFiZS03YWIxLTQxMzktOGVjNC05NDQ2MDQ0YzJiZjcvIiwiaWR0eXAiOiJhcHAiLCJvaWQiOiIxMDNmZTMyYy1mMWRmLTRiZWYtOWVmZS1hYzNhNmNjNDU4ZDMiLCJyaCI6IjEuQVFrQXZ0cHhhYkY2T1VHT3hKUkdCRXdyOTBaSWYza0F1dGRQdWtQYXdmajJNQk1KQUFBSkFBLiIsInN1YiI6IjEwM2ZlMzJjLWYxZGYtNGJlZi05ZWZlLWFjM2E2Y2M0NThkMyIsInRpZCI6IjY5NzFkYWJlLTdhYjEtNDEzOS04ZWM0LTk0NDYwNDRjMmJmNyIsInV0aSI6InNTTHdwRTdPTDB5eXFSRjVialNGQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfaWRyZWwiOiI3IDMyIiwieG1zX3RjZHQiOjE0MDM2MDQxMzZ9.VZkXcokT-Suzn0BhDYE40aA9hHDGfcSYpl8NSGoKhgT4b4G187hU_vyhYSNtbfZUaYD9_d2XYbGU8oYa5EbnC8fFd8XTWAfLO4v9E_d11as64vZEAAjJcsFG7DgscKMxpUD_sX0shUfrcBY-S44c10p3N85TfkWYwmSgv2gOSw3d5SIzgfmaJwCVKk0o4BGTV3OAn5i8z6TerOIPr2kShJpUHhR1x3os_GgkKMM0RU336o833nreZo_ykfvMLFSImzqIIiTx7K40IGY5YCq0bMRfwvTO9mzjCDwhyApghtxPcpqFU85lPpj_cKf_B2NQk9jqnWJ4Es1UlX5DIUPO9w';

  documentNames: { [key: string]: string[] } = {
    'Business Profile': ['Company Logo', 'Business Profile Document'],
    'Business Proof Of Identity': ['Company Registration Document', 'Tax Identification Number (TIN)'],
    'Business Financial Documents': ['Financial Statements', 'Invoices', 'Tax Returns'],
    'Business Legal Documents': ['Contracts', 'Non-Disclosure Agreements']
  };

  documentCategories = [
    'Business Profile',
    'Business Proof Of Identity',
    'Business Financial Documents',
    'Business Legal Documents'
  ];

  documentTypes = ['IMAGE', 'PDF', 'DOC', 'XLS'];

  documentSelections: DocumentSelection[] = this.documentCategories.map(category => ({
    category,
    documentName: '',
    documentType: '',
    fileName: '',
    file: null,
    uploadStatus: ''
  }));

  constructor(
    private message: NzMessageService,
    private http: HttpClient
  ) { }

  getDocumentNamesByCategory(category: string): string[] {
    return this.documentNames[category as keyof typeof this.documentNames] || [];
  }

  async handleFileChange(event: Event, category: string): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const index: number = this.documentCategories.indexOf(category);
      if (index !== -1) {
        this.documentSelections[index].fileName = file.name;
        this.documentSelections[index].file = file;
        this.documentSelections[index].uploadStatus = 'uploading';
        this.message.info(`Uploading ${file.name}...`);

        try {
          const sharepointUrl: string = await this.uploadFileToSharePoint(file);
          this.documentSelections[index].uploadStatus = 'success';
          this.documentSelections[index].sharepointUrl = sharepointUrl;
          this.message.success(`${file.name} uploaded successfully!`);

          this.updateDocuments();
        } catch (error) {
          this.documentSelections[index].uploadStatus = 'error';
          this.message.error(`Failed to upload ${file.name}`);
          console.error('Upload error:', error);

          this.updateDocuments();
        }
      }
    }
  }

  private uploadFileToSharePoint(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('files', file);

      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.authToken}`,
      });

      this.http.post<any>(
        'api/v1/sharepoint/upload-file?folderName=business-documents',
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

  previewDocument(index: number): void {
    const doc = this.documentSelections[index];
    if (doc.file) {
      // In a real app, you would implement actual preview logic here
      this.message.info(`Previewing ${doc.fileName}`);
    }
  }

  collectDocumentData(): DocumentData[] {
    return this.documentSelections.map((selection: DocumentSelection, index: number): DocumentData => ({
      id: (index + 1).toString(),
      category: selection.category,
      type: selection.documentType,
      name: selection.documentName,
      file: selection.file,
      url: selection.file ? `https://cbzco.sharepoint.com/sites/KaribuTech/Shared%20Documents/business-documents/${encodeURIComponent(selection.file.name)}` : '',
      expiryDate: '',
      uploadDate: new Date().toISOString(),
      status: selection.file ? 'uploaded' : 'pending',
      uploadStatus: selection.uploadStatus
    }));
  }

  updateDocuments(): void {
    const documents: DocumentData[] = this.collectDocumentData();

    const isValid = documents.some((doc: DocumentData) => doc.status === 'uploaded');

    this.dataUpdated.emit({
      documents: documents,
      isValid: isValid
    });
  }
  ngOnInit(): void {
    if (this.businessData.documents && this.businessData.documents.length > 0) {
      this.documentSelections = this.documentCategories.map((category: string): DocumentSelection => {
        const existingDoc = this.businessData.documents.find((d: any) => d.category === category);
        return existingDoc ? {
          category,
          documentName: existingDoc.name,
          documentType: existingDoc.type,
          fileName: existingDoc.name,
          file: null,
          uploadStatus: existingDoc.status === 'uploaded' ? 'success' : ''
        } : {
          category,
          documentName: '',
          documentType: '',
          fileName: '',
          file: null,
          uploadStatus: ''
        };
      });
    }
  }

  uploadLater(category: string, index: number): void {
    this.documentSelections[index].fileName = 'Will upload later';
    this.documentSelections[index].file = null;
    this.documentSelections[index].uploadStatus = 'pending';
    this.message.warning(`You selected to upload ${category} later`);
    this.updateDocuments();
  }
}