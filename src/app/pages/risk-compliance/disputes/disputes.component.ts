import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Dispute {
  id: string;
  merchant: string;
  merchantId: string;
  reason: string;
  reasonCode: string;
  cardScheme: string;
  amount: number;
  status: 'open' | 'evidence_required' | 'under_review' | 'won' | 'lost';
  dueDate: string;
  daysLeft: number;
}

interface ReasonData {
  reason: string;
  count: number;
}

interface SLAItem {
  type: 'overdue' | 'urgent' | 'normal';
  label: string;
  description: string;
  count: number;
  color: string;
}

@Component({
  selector: 'app-disputes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disputes.component.html',
  styleUrls: ['./disputes.component.css']
})
export class DisputesComponent {
  // Stats
  openDisputes = 23;
  openDisputesRisk = '$12,450 at risk';
  
  evidenceRequired = 8;
  evidenceRequiredNote = 'Action needed';
  
  winRate = 72;
  winRateChange = '+5%';
  
  avgResolution = 8.5;
  avgResolutionUnit = 'days';
  
  selectedFilter = 'All';
  filters = ['All', 'Open', 'Evidence Required', 'Under Review'];
  
  searchQuery = '';
  
  disputes: Dispute[] = [
    {
      id: 'DSP240115001',
      merchant: 'Spar Supermarket',
      merchantId: 'TXN240115001',
      reason: 'No Cardholder Authorization',
      reasonCode: 'Code: 4837',
      cardScheme: 'Visa',
      amount: 450.00,
      status: 'open',
      dueDate: '2024-01-22',
      daysLeft: 7
    },
    {
      id: 'DSP240114001',
      merchant: 'OK Zimbabwe',
      merchantId: 'TXN240108002',
      reason: 'Cardholder Dispute',
      reasonCode: 'Code: 4853',
      cardScheme: 'Mastercard',
      amount: 1250.00,
      status: 'evidence_required',
      dueDate: '2024-01-18',
      daysLeft: 3
    },
    {
      id: 'DSP240113001',
      merchant: 'TM Pick n Pay',
      merchantId: 'TXN240107003',
      reason: 'Duplicate Processing',
      reasonCode: 'Code: 4834',
      cardScheme: 'Visa',
      amount: 780.00,
      status: 'under_review',
      dueDate: '2024-01-25',
      daysLeft: 10
    },
    {
      id: 'DSP240112001',
      merchant: 'Chicken Inn',
      merchantId: 'TXN240106004',
      reason: 'Services Not Rendered',
      reasonCode: 'Code: 4855',
      cardScheme: 'Mastercard',
      amount: 340.00,
      status: 'open',
      dueDate: '2024-01-20',
      daysLeft: 5
    },
    {
      id: 'DSP240111001',
      merchant: 'Edgars',
      merchantId: 'TXN240105005',
      reason: 'Goods Not Received',
      reasonCode: 'Code: 4855',
      cardScheme: 'Visa',
      amount: 2100.00,
      status: 'evidence_required',
      dueDate: '2024-01-16',
      daysLeft: 1
    }
  ];
  
  reasonsData: ReasonData[] = [
    { reason: 'No Auth', count: 12 },
    { reason: 'Cardholder Dispute', count: 8 },
    { reason: 'Duplicate', count: 6 },
    { reason: 'Services Not Rendered', count: 5 },
    { reason: 'Goods Not Received', count: 4 }
  ];
  
  slaItems: SLAItem[] = [
    {
      type: 'overdue',
      label: 'Overdue',
      description: 'Past deadline',
      count: 3,
      color: '#dc2626'
    },
    {
      type: 'urgent',
      label: 'Due in 3 days',
      description: 'Urgent attention',
      count: 5,
      color: '#ca8a04'
    },
    {
      type: 'normal',
      label: 'Due in 7+ days',
      description: 'Within SLA',
      count: 15,
      color: '#0891b2'
    }
  ];
  
  get filteredDisputes(): Dispute[] {
    let filtered = this.disputes;
    
    if (this.selectedFilter !== 'All') {
      if (this.selectedFilter === 'Open') {
        filtered = filtered.filter(d => d.status === 'open');
      } else if (this.selectedFilter === 'Evidence Required') {
        filtered = filtered.filter(d => d.status === 'evidence_required');
      } else if (this.selectedFilter === 'Under Review') {
        filtered = filtered.filter(d => d.status === 'under_review');
      }
    }
    
    if (this.searchQuery) {
      filtered = filtered.filter(d =>
        d.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        d.merchant.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        d.reason.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }
  
  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }
  
  getStatusClass(status: string): string {
    return `status-${status.replace('_', '-')}`;
  }
  
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'open': 'open',
      'evidence_required': 'evidence required',
      'under_review': 'under review',
      'won': 'won',
      'lost': 'lost'
    };
    return labels[status] || status;
  }
  
  getDaysLeftClass(days: number): string {
    if (days <= 0) return 'days-overdue';
    if (days <= 3) return 'days-urgent';
    return 'days-normal';
  }
  
  formatAmount(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }
  
  getMaxReasonCount(): number {
    return Math.max(...this.reasonsData.map(r => r.count));
  }
  
  getBarHeight(count: number): number {
    const max = this.getMaxReasonCount();
    return (count / max) * 100;
  }
}