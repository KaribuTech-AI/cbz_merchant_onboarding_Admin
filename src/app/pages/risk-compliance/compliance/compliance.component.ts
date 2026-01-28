import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ComplianceScore {
  label: string;
  score: number;
  icon: string;
}

interface ComplianceRequirement {
  id: string;
  requirement: string;
  category: string;
  compliance: number;
  status: 'complete' | 'action-required' | 'in-progress';
  lastReview: string;
  nextReview: string;
  owner: string;
}

interface Audit {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
  findings: number;
}

interface Report {
  id: string;
  name: string;
  dueDate: string;
  status: 'pending' | 'not-started' | 'submitted';
}

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.css']
})
export class ComplianceComponent {
  // Page title
  pageTitle = 'Compliance';
  pageSubtitle = 'Regulatory compliance and audit management';

  // Overall score
  overallScore = 94;

  // Compliance scores
  complianceScores: ComplianceScore[] = [
    { label: 'KYC/KYB', score: 98, icon: 'users' },
    { label: 'AML', score: 92, icon: 'shield' },
    { label: 'PCI-DSS', score: 96, icon: 'lock' },
    { label: 'R&A', score: 91, icon: 'file-text' }
  ];

  // Action required count
  actionRequiredCount = 2;
  actionRequiredText = '2 compliance requirements need attention before their review dates.';

  // Upcoming deadlines
  upcomingDeadlines = 'Monthly AML Report due on January 31, 2024. Weekly SAR report due January 19, 2024.';

  // Active filter
  activeFilter: 'all' | 'action-required' | 'kyc-kyb' | 'aml' | 'pci-dss' = 'all';

  // Compliance requirements
  complianceRequirements: ComplianceRequirement[] = [
    {
      id: 'REQ001',
      requirement: 'Customer Due Diligence (CDD)',
      category: 'KYC/KYB',
      compliance: 100,
      status: 'complete',
      lastReview: '2024-01-10',
      nextReview: '2024-04-10',
      owner: 'Compliance Team'
    },
    {
      id: 'REQ002',
      requirement: 'Transaction Monitoring',
      category: 'AML',
      compliance: 98,
      status: 'complete',
      lastReview: '2024-01-12',
      nextReview: '2024-02-12',
      owner: 'Risk Team'
    },
    {
      id: 'REQ003',
      requirement: 'Data Security Standards',
      category: 'PCI-DSS',
      compliance: 96,
      status: 'complete',
      lastReview: '2023-12-15',
      nextReview: '2024-03-15',
      owner: 'IT Security'
    },
    {
      id: 'REQ004',
      requirement: 'Reserve Bank Reporting',
      category: 'R&A',
      compliance: 85,
      status: 'action-required',
      lastReview: '2024-01-05',
      nextReview: '2024-01-20',
      owner: 'Finance Team'
    },
    {
      id: 'REQ005',
      requirement: 'Enhanced Due Diligence (EDD)',
      category: 'KYC/KYB',
      compliance: 94,
      status: 'complete',
      lastReview: '2024-01-08',
      nextReview: '2024-04-08',
      owner: 'Compliance Team'
    }
  ];

  // Recent audits
  recentAudits: Audit[] = [
    {
      id: 'AUD001',
      name: 'KYC Procedures',
      type: 'Internal Audit - Internal Audit Team',
      date: '2024-01-15',
      status: 'completed',
      findings: 2
    },
    {
      id: 'AUD002',
      name: 'PCI-DSS Compliance',
      type: 'External Audit - PwC Zimbabwe',
      date: '2024-01-13',
      status: 'completed',
      findings: 1
    },
    {
      id: 'AUD003',
      name: 'AML Framework',
      type: 'Regulatory Review - Reserve Bank of Zimbabwe',
      date: '2024-01-05',
      status: 'in-progress',
      findings: 0
    },
    {
      id: 'AUD004',
      name: 'Merchant Onboarding',
      type: 'Internal Audit - Internal Audit Team',
      date: '2023-12-20',
      status: 'completed',
      findings: 3
    }
  ];

  // Regulatory reports
  regulatoryReports: Report[] = [
    {
      id: 'REP001',
      name: 'Monthly AML Report',
      dueDate: '2024-01-31 (Monthly)',
      status: 'pending'
    },
    {
      id: 'REP002',
      name: 'Quarterly Transaction Report',
      dueDate: '2024-03-31 (Quarterly)',
      status: 'not-started'
    },
    {
      id: 'REP003',
      name: 'Annual Compliance Certificate',
      dueDate: '2024-12-31 (Annual)',
      status: 'not-started'
    },
    {
      id: 'REP004',
      name: 'Weekly Suspicious Activity Report',
      dueDate: '2024-01-19 (Weekly)',
      status: 'submitted'
    },
    {
      id: 'REP005',
      name: 'PCI-DSS Attestation',
      dueDate: '2024-06-30 (Annual)',
      status: 'not-started'
    }
  ];

  setFilter(filter: 'all' | 'action-required' | 'kyc-kyb' | 'aml' | 'pci-dss'): void {
    this.activeFilter = filter;
  }

  get filteredRequirements(): ComplianceRequirement[] {
    if (this.activeFilter === 'all') {
      return this.complianceRequirements;
    }
    if (this.activeFilter === 'action-required') {
      return this.complianceRequirements.filter(req => req.status === 'action-required');
    }
    if (this.activeFilter === 'kyc-kyb') {
      return this.complianceRequirements.filter(req => req.category === 'KYC/KYB');
    }
    if (this.activeFilter === 'aml') {
      return this.complianceRequirements.filter(req => req.category === 'AML');
    }
    if (this.activeFilter === 'pci-dss') {
      return this.complianceRequirements.filter(req => req.category === 'PCI-DSS');
    }
    return this.complianceRequirements;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getComplianceClass(compliance: number): string {
    if (compliance >= 95) return 'compliance-excellent';
    if (compliance >= 90) return 'compliance-good';
    if (compliance >= 80) return 'compliance-warning';
    return 'compliance-critical';
  }

  getAuditStatusClass(status: string): string {
    return `audit-${status}`;
  }

  getReportStatusClass(status: string): string {
    return `report-${status}`;
  }

  viewRequirement(id: string): void {
    console.log('Viewing requirement:', id);
  }

  exportReport(): void {
    console.log('Exporting report');
  }

  viewCalendar(): void {
    console.log('Viewing calendar');
  }

  viewRequirements(): void {
    console.log('Viewing requirements');
  }
}