import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PaymentSummary {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

interface Payment {
  paymentId: string;
  invoice: string;
  customer: string;
  amount: number;
  method: string;
  methodIcon: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference: string;
}

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent {
  // Summary cards
  paymentSummary: PaymentSummary[] = [
    { label: 'Total Payments', value: 6, icon: 'trending-up', color: 'pink' },
    { label: 'Received', value: '$7,281.25', icon: 'check-circle', color: 'green' },
    { label: 'Pending', value: '$1,000', icon: 'clock', color: 'yellow' },
    { label: 'Failed', value: '$3,200', icon: 'x-circle', color: 'red' }
  ];

  // Filter states
  selectedStatus = 'All Status';
  selectedMethod = 'All Methods';

  // Payment data
  payments: Payment[] = [
    {
      paymentId: 'PAY-2024-001',
      invoice: 'INV-2024-002',
      customer: 'Metro Supermarket',
      amount: 1890.50,
      method: 'Bank Transfer',
      methodIcon: 'bank',
      status: 'completed',
      date: '2024-01-28',
      reference: 'TRF-8847291'
    },
    {
      paymentId: 'PAY-2024-002',
      invoice: 'INV-2024-004',
      customer: 'Hardware Supplies Co',
      amount: 890.75,
      method: 'Card Payment',
      methodIcon: 'card',
      status: 'completed',
      date: '2024-01-25',
      reference: 'CRD-9982341'
    },
    {
      paymentId: 'PAY-2024-003',
      invoice: 'INV-2024-001',
      customer: 'ABC Retailers Ltd',
      amount: 1000.00,
      method: 'Mobile Money',
      methodIcon: 'mobile',
      status: 'pending',
      date: '2024-01-27',
      reference: 'MOB-5523891'
    },
    {
      paymentId: 'PAY-2024-004',
      invoice: 'INV-2024-006',
      customer: 'Electronics Hub',
      amount: 2250.00,
      method: 'Bank Transfer',
      methodIcon: 'bank',
      status: 'completed',
      date: '2024-01-26',
      reference: 'TRF-7729183'
    },
    {
      paymentId: 'PAY-2024-005',
      invoice: 'INV-2024-003',
      customer: 'City Pharmacy',
      amount: 3200.00,
      method: 'Card Payment',
      methodIcon: 'card',
      status: 'failed',
      date: '2024-01-24',
      reference: 'CRD-1129384'
    },
    {
      paymentId: 'PAY-2024-006',
      invoice: 'INV-2024-008',
      customer: 'Electronics Hub',
      amount: 2250.00,
      method: 'Mobile Money',
      methodIcon: 'mobile',
      status: 'completed',
      date: '2024-01-23',
      reference: 'MOB-8823912'
    }
  ];

  searchPayments(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    console.log('Searching for:', searchTerm);
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    console.log('Filter by status:', status);
  }

  filterByMethod(method: string): void {
    this.selectedMethod = method;
    console.log('Filter by method:', method);
  }

  exportPayments(): void {
    console.log('Exporting payments');
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getMethodIcon(icon: string): string {
    return icon;
  }
}