import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FraudAlert {
  alertId: string;
  transaction: string;
  card: string;
  amount: number;
  riskScore: number;
  type: string;
  flags: string[];
  status: 'approved' | 'blocked' | 'pending';
  time: string;
}

interface BlockedCard {
  cardNumber: string;
  blockedDate: string;
  reason: string;
  merchant: string;
}

interface FraudType {
  name: string;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-fraud-detection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fraud-detection.component.html',
  styleUrls: ['./fraud-detection.component.css']
})
export class FraudDetectionComponent {
  // Make Math available in template
  Math = Math;
  
  // Summary statistics
  fraudAlertsToday = 6;
  alertsChange = -16;
  blockedTransactions = 2;
  blockedAmount = 4120;
  pendingReview = 2;
  detectionRate = 99.2;
  detectionChange = 0.3;

  // Filter state
  activeFilter: 'all' | 'pending' | 'blocked' | 'approved' = 'all';

  // Fraud types data
  fraudTypes: FraudType[] = [
    { name: 'Card Testing', percentage: 35, color: '#dc2626' },
    { name: 'Account Takeover', percentage: 25, color: '#f59e0b' },
    { name: 'Stolen Card', percentage: 20, color: '#3b82f6' },
    { name: 'Friendly Fraud', percentage: 12, color: '#8b5cf6' },
    { name: 'Other', percentage: 8, color: '#6b7280' }
  ];

  // Chart data for trend
  chartData = [
    { time: '00:00', value: 20 },
    { time: '04:00', value: 35 },
    { time: '08:00', value: 45 },
    { time: '12:00', value: 52 },
    { time: '16:00', value: 42 },
    { time: '20:00', value: 28 },
    { time: '23:59', value: 20 }
  ];

  // Fraud alerts data
  fraudAlerts: FraudAlert[] = [
    {
      alertId: 'FRD001',
      transaction: 'Electronics World',
      card: '****4521',
      amount: 2850,
      riskScore: 95,
      type: 'Card Testing',
      flags: ['Velocity'],
      status: 'blocked',
      time: '16:32:00'
    },
    {
      alertId: 'FRD006',
      transaction: 'AutoParts Direct',
      card: '****5589',
      amount: 6780,
      riskScore: 92,
      type: 'Card Testing',
      flags: ['Velocity', 'Geo'],
      status: 'blocked',
      time: '15:56:00'
    },
    {
      alertId: 'FRD004',
      transaction: 'Grocery Express',
      card: '****9045',
      amount: 890,
      riskScore: 72,
      type: 'Velocity Alert',
      flags: ['Velocity'],
      status: 'approved',
      time: '16:10:00'
    },
    {
      alertId: 'FRD005',
      transaction: 'Book Haven',
      card: '****3367',
      amount: 345,
      riskScore: 65,
      type: 'Unusual Amount',
      flags: [],
      status: 'approved',
      time: '14:05:00'
    }
  ];

  // Blocked cards data
  blockedCards: BlockedCard[] = [
    {
      cardNumber: '****4521',
      blockedDate: '2024-01-15',
      reason: 'Multiple failed attempts',
      merchant: 'Electronics World'
    },
    {
      cardNumber: '****5589',
      blockedDate: '2024-01-15',
      reason: 'Suspected fraud',
      merchant: 'AutoParts Direct'
    },
    {
      cardNumber: '****2341',
      blockedDate: '2024-01-14',
      reason: 'Reported stolen',
      merchant: 'N/A'
    },
    {
      cardNumber: '****8976',
      blockedDate: '2024-01-13',
      reason: 'Chargeback fraud',
      merchant: 'Fashion Hub'
    }
  ];

  setFilter(filter: 'all' | 'pending' | 'blocked' | 'approved'): void {
    this.activeFilter = filter;
  }

  get filteredAlerts(): FraudAlert[] {
    if (this.activeFilter === 'all') {
      return this.fraudAlerts;
    }
    return this.fraudAlerts.filter(alert => alert.status === this.activeFilter);
  }

  getRiskScoreClass(score: number): string {
    if (score >= 90) return 'risk-critical';
    if (score >= 70) return 'risk-high';
    if (score >= 50) return 'risk-medium';
    return 'risk-low';
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  unblockCard(cardNumber: string): void {
    console.log('Unblocking card:', cardNumber);
    // Implementation would go here
  }

  viewAlertDetails(alertId: string): void {
    console.log('Viewing alert:', alertId);
    // Implementation would go here
  }

  viewTransaction(alertId: string): void {
    console.log('Viewing transaction:', alertId);
    // Implementation would go here
  }

  blockCard(alertId: string): void {
    console.log('Blocking card for alert:', alertId);
    // Implementation would go here
  }
}