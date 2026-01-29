import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReportCategory {
  icon: string;
  title: string;
  count: number;
}

interface Report {
  id: string;
  name: string;
  category: string;
  type: string;
  frequency: string;
  lastRun: string;
  nextRun: string;
  format: string;
  status: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  activeTab: string = 'saved';
  searchQuery: string = '';
  
  reportCategories: ReportCategory[] = [
    { icon: '💳', title: 'Transaction Reports', count: 12 },
    { icon: '👥', title: 'Merchant Reports', count: 8 },
    { icon: '📊', title: 'Settlement Reports', count: 6 },
    { icon: '🛡️', title: 'Risk & Fraud Reports', count: 5 },
    { icon: '📋', title: 'Compliance Reports', count: 4 },
    { icon: '📈', title: 'Performance Reports', count: 7 }
  ];
  
  savedReports: Report[] = [
    {
      id: '1',
      name: 'Daily Transaction Summary',
      category: 'Transaction',
      type: 'Scheduled',
      frequency: 'Daily',
      lastRun: '2024-01-15 06:00',
      nextRun: '2024-01-16 06:00',
      format: 'PDF',
      status: 'active'
    },
    {
      id: '2',
      name: 'Weekly Merchant Performance',
      category: 'Merchant',
      type: 'Scheduled',
      frequency: 'Weekly',
      lastRun: '2024-01-14 08:00',
      nextRun: '2024-01-21 08:00',
      format: 'Excel',
      status: 'active'
    },
    {
      id: '3',
      name: 'Monthly Settlement Reconciliation',
      category: 'Settlement',
      type: 'Scheduled',
      frequency: 'Monthly',
      lastRun: '2024-01-01 00:00',
      nextRun: '2024-02-01 00:00',
      format: 'PDF',
      status: 'active'
    },
    {
      id: '4',
      name: 'Fraud Detection Analysis',
      category: 'Risk',
      type: 'On-Demand',
      frequency: 'N/A',
      lastRun: '2024-01-12 14:30',
      nextRun: 'N/A',
      format: 'PDF',
      status: 'active'
    },
    {
      id: '5',
      name: 'Compliance Audit Report',
      category: 'Compliance',
      type: 'Scheduled',
      frequency: 'Quarterly',
      lastRun: '2024-01-01 00:00',
      nextRun: '2024-04-01 00:00',
      format: 'PDF',
      status: 'active'
    },
    {
      id: '6',
      name: 'Channel Performance Dashboard',
      category: 'Performance',
      type: 'Scheduled',
      frequency: 'Daily',
      lastRun: '2024-01-15 07:00',
      nextRun: '2024-01-16 07:00',
      format: 'Excel',
      status: 'paused'
    }
  ];
  
  get filteredReports(): Report[] {
    if (!this.searchQuery) {
      return this.savedReports;
    }
    return this.savedReports.filter(report =>
      report.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      report.category.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  
  createReport(): void {
    console.log('Create new report');
    // Implement create report logic
  }
  
  refreshReport(reportId: string): void {
    console.log('Refreshing report:', reportId);
    // Implement refresh logic
  }
  
  downloadReport(reportId: string): void {
    console.log('Downloading report:', reportId);
    // Implement download logic
  }
  
  emailReport(reportId: string): void {
    console.log('Emailing report:', reportId);
    // Implement email logic
  }
  
  filterReports(): void {
    console.log('Opening filter options');
    // Implement filter logic
  }
}