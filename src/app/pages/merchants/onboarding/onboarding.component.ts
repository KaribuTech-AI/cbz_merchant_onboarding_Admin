import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Application {
  id: string;
  businessName: string;
  category: string;
  type: string;
  stage: string;
  progress: number;
  status: string;
  riskScore: number | null;
  documents: string;
  assignedTo: string;
  submittedDate?: string;
  email?: string;
  phone?: string;
  address?: string;
  registrationNo?: string;
  taxId?: string;
  expectedVolume?: string;
  contactPerson?: string;
  contactTitle?: string;
  paymentChannels?: string[];
  documentList?: Array<{
    name: string;
    status: string;
    date?: string;
  }>;
  timeline?: Array<{
    event: string;
    date: string;
    by: string;
  }>;
  notes?: Array<{
    author: string;
    date: string;
    text: string;
  }>;
}

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {
  // Stats
  stats = {
    totalApplications: 156,
    totalChange: '+32 this week',
    inProgress: 89,
    inProgressDays: 'Avg. 3.2 days processing',
    approved: 42,
    approvalRate: '87% approval rate',
    pendingDocs: 25,
    pendingAction: 'Action required'
  };

  // Pipeline stages
  pipeline = [
    { name: 'Application', count: 12 },
    { name: 'Pre-Screening', count: 18 },
    { name: 'KYC/AML', count: 24 },
    { name: 'Risk Assessment', count: 15 },
    { name: 'Approval', count: 8 },
    { name: 'Activation', count: 12 }
  ];

  // Applications data
  applications: Application[] = [
    {
      id: 'APP001',
      businessName: 'Delta Corporation',
      category: 'Manufacturing',
      type: 'Corporate',
      stage: 'KYC Verification',
      progress: 60,
      status: 'in progress',
      riskScore: 35,
      documents: '4/6',
      assignedTo: 'Jane Smith',
      submittedDate: '2024-01-15',
      email: 'finance@deltacorp.co.zw',
      phone: '+263 77 123 4567',
      address: '123 Samora Machel Ave, Harare',
      registrationNo: 'BR2024/001234',
      taxId: 'TAX/2024/56789',
      expectedVolume: '$500,000+/month',
      contactPerson: 'John Moyo',
      contactTitle: 'Finance Director',
      paymentChannels: ['POS', 'E-Commerce', 'QR Payments'],
      documentList: [
        { name: 'Certificate of Incorporation', status: 'verified', date: '2024-01-15' },
        { name: 'Tax Clearance Certificate', status: 'verified', date: '2024-01-15' },
        { name: 'Director ID Documents', status: 'verified', date: '2024-01-14' },
        { name: 'Bank Statements (6 months)', status: 'verified', date: '2024-01-14' },
        { name: 'Proof of Address', status: 'pending' },
        { name: 'Beneficial Ownership Declaration', status: 'pending' }
      ],
      timeline: [
        { event: 'Application submitted', date: '2024-01-15 09:30', by: 'Online Portal' },
        { event: 'Assigned to reviewer', date: '2024-01-15 10:15', by: 'System' },
        { event: 'Pre-screening completed', date: '2024-01-16 14:50', by: 'Mike Johnson' },
        { event: 'KYC verification started', date: '2024-01-16 09:00', by: 'Jane Smith' }
      ],
      notes: [
        { author: 'Mike Johnson', date: '2024-01-16', text: 'Large corporate client with good banking history. Recommend fast-tracking.' },
        { author: 'Jane Smith', date: '2024-01-16', text: 'Waiting for additional proof of address document.' }
      ]
    },
    {
      id: 'APP003',
      businessName: 'Techno Hub Electronics',
      category: 'Electronics Retail',
      type: 'SME',
      stage: 'Final Approval',
      progress: 90,
      status: 'in progress',
      riskScore: 28,
      documents: '5/5',
      assignedTo: 'Sarah Wilson',
      submittedDate: '2024-01-10',
      email: 'info@technohub.co.zw',
      phone: '+263 77 234 5678',
      address: '45 Harare Drive, Harare',
      registrationNo: 'BR2024/002345',
      taxId: 'TAX/2024/67890',
      expectedVolume: '$50,000+/month',
      contactPerson: 'Sarah Ncube',
      contactTitle: 'Owner',
      paymentChannels: ['POS', 'Mobile App'],
      documentList: [
        { name: 'Certificate of Incorporation', status: 'verified', date: '2024-01-10' },
        { name: 'Tax Clearance Certificate', status: 'verified', date: '2024-01-10' },
        { name: 'Director ID Documents', status: 'verified', date: '2024-01-10' },
        { name: 'Bank Statements (6 months)', status: 'verified', date: '2024-01-11' },
        { name: 'Proof of Address', status: 'verified', date: '2024-01-11' }
      ],
      timeline: [
        { event: 'Application submitted', date: '2024-01-10 14:20', by: 'Online Portal' },
        { event: 'Pre-screening completed', date: '2024-01-11 09:15', by: 'Mike Johnson' },
        { event: 'KYC verification completed', date: '2024-01-13 16:30', by: 'Sarah Wilson' },
        { event: 'Risk assessment passed', date: '2024-01-14 11:00', by: 'System' }
      ],
      notes: [
        { author: 'Sarah Wilson', date: '2024-01-14', text: 'All documents verified. Ready for final approval.' }
      ]
    },
    {
      id: 'APP004',
      businessName: 'Sunrise Restaurant',
      category: 'Food & Beverage',
      type: 'Retail',
      stage: 'Risk Assessment',
      progress: 70,
      status: 'in progress',
      riskScore: 52,
      documents: '4/4',
      assignedTo: 'Jane Smith',
      submittedDate: '2024-01-12',
      email: 'info@sunrise.co.zw',
      phone: '+263 77 345 6789',
      address: '78 Robert Mugabe Rd, Harare',
      registrationNo: 'BR2024/003456',
      taxId: 'TAX/2024/78901',
      expectedVolume: '$30,000+/month',
      contactPerson: 'David Chikwanha',
      contactTitle: 'Manager',
      paymentChannels: ['POS', 'QR Payments'],
      documentList: [
        { name: 'Certificate of Incorporation', status: 'verified', date: '2024-01-12' },
        { name: 'Tax Clearance Certificate', status: 'verified', date: '2024-01-12' },
        { name: 'Director ID Documents', status: 'verified', date: '2024-01-13' },
        { name: 'Bank Statements (6 months)', status: 'verified', date: '2024-01-13' }
      ],
      timeline: [
        { event: 'Application submitted', date: '2024-01-12 11:45', by: 'Online Portal' },
        { event: 'Pre-screening completed', date: '2024-01-12 15:20', by: 'Mike Johnson' },
        { event: 'KYC verification started', date: '2024-01-13 10:00', by: 'Jane Smith' }
      ],
      notes: []
    }
  ];

  filteredApplications: Application[] = [];
  
  // Active tab
  activeTab: string = 'all';
  
  // Modals and panels
  showNewApplicationModal: boolean = false;
  selectedApplication: Application | null = null;
  
  // Active detail tab
  activeDetailTab: string = 'business';
  
  // Search term
  searchTerm: string = '';
  
  // New application form
  newApplication = {
    businessName: '',
    applicationType: '',
    email: '',
    phone: '',
    address: '',
    registrationNo: '',
    taxId: '',
    industry: '',
    paymentChannels: [] as string[],
    assignTo: ''
  };

  ngOnInit(): void {
    this.filteredApplications = [...this.applications];
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.filterApplications();
  }

  filterApplications(): void {
    this.filteredApplications = this.applications.filter(app => {
      if (this.activeTab === 'all') return true;
      if (this.activeTab === 'inProgress') return app.status === 'in progress';
      if (this.activeTab === 'pendingDocs') return app.documents.includes('/') && !app.documents.startsWith('5/5');
      if (this.activeTab === 'rejected') return app.status === 'rejected';
      return true;
    });
  }

  openNewApplicationModal(): void {
    this.showNewApplicationModal = true;
  }

  closeNewApplicationModal(): void {
    this.showNewApplicationModal = false;
    this.resetNewApplicationForm();
  }

  resetNewApplicationForm(): void {
    this.newApplication = {
      businessName: '',
      applicationType: '',
      email: '',
      phone: '',
      address: '',
      registrationNo: '',
      taxId: '',
      industry: '',
      paymentChannels: [],
      assignTo: ''
    };
  }

  togglePaymentChannel(channel: string): void {
    const index = this.newApplication.paymentChannels.indexOf(channel);
    if (index > -1) {
      this.newApplication.paymentChannels.splice(index, 1);
    } else {
      this.newApplication.paymentChannels.push(channel);
    }
  }

  createApplication(): void {
    // Create new application object
    const newApp: Application = {
      id: `APP${String(this.applications.length + 1).padStart(3, '0')}`,
      businessName: this.newApplication.businessName,
      category: this.newApplication.industry,
      type: this.newApplication.applicationType,
      stage: 'Application',
      progress: 10,
      status: 'in progress',
      riskScore: null,
      documents: '0/6',
      assignedTo: this.getAssignedToName(this.newApplication.assignTo),
      submittedDate: new Date().toISOString().split('T')[0],
      email: this.newApplication.email,
      phone: this.newApplication.phone,
      address: this.newApplication.address,
      registrationNo: this.newApplication.registrationNo,
      taxId: this.newApplication.taxId,
      paymentChannels: [...this.newApplication.paymentChannels],
      documentList: [
        { name: 'Certificate of Incorporation', status: 'pending' },
        { name: 'Tax Clearance Certificate', status: 'pending' },
        { name: 'Director ID Documents', status: 'pending' },
        { name: 'Bank Statements (6 months)', status: 'pending' },
        { name: 'Proof of Address', status: 'pending' },
        { name: 'Beneficial Ownership Declaration', status: 'pending' }
      ],
      timeline: [
        {
          event: 'Application submitted',
          date: new Date().toLocaleString(),
          by: 'Online Portal'
        }
      ],
      notes: []
    };

    // Add to applications
    this.applications.unshift(newApp);
    this.filterApplications();

    // Close modal
    this.closeNewApplicationModal();

    console.log('Application created:', newApp);
  }

  getAssignedToName(assignTo: string): string {
    const names: { [key: string]: string } = {
      'jane': 'Jane Smith',
      'sarah': 'Sarah Wilson',
      'mike': 'Mike Johnson'
    };
    return names[assignTo] || 'Unassigned';
  }

  viewApplication(app: Application): void {
    this.selectedApplication = app;
    this.activeDetailTab = 'business';
  }

  closeApplicationDetail(): void {
    this.selectedApplication = null;
  }

  getRiskScoreClass(score: number | null): string {
    if (score === null) return '';
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    return 'high';
  }

  getInitials(name?: string): string {
    if (!name) return 'N/A';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  downloadDocument(doc: any): void {
    console.log('Downloading document:', doc.name);
    // Implement download logic
  }

  addNote(): void {
    const noteText = (document.querySelector('.note-input') as HTMLTextAreaElement)?.value;
    if (!noteText || !this.selectedApplication) return;

    const newNote = {
      author: 'Current User',
      date: new Date().toISOString().split('T')[0],
      text: noteText
    };

    if (!this.selectedApplication.notes) {
      this.selectedApplication.notes = [];
    }

    this.selectedApplication.notes.unshift(newNote);

    // Clear textarea
    const textarea = document.querySelector('.note-input') as HTMLTextAreaElement;
    if (textarea) textarea.value = '';
  }

  continueReview(): void {
    console.log('Continue review for:', this.selectedApplication?.businessName);
    // Implement review continuation logic
  }

  requestDocuments(): void {
    console.log('Request documents for:', this.selectedApplication?.businessName);
    // Implement document request logic
  }
}