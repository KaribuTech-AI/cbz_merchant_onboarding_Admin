import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BillingSummary {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

interface RecurringBilling {
  id: string;
  description: string;
  customer: string;
  amount: number;
  frequency: 'Monthly' | 'Yearly' | 'Quarterly';
  nextBilling: string;
  status: 'active' | 'paused' | 'cancelled';
  totalBilled: number;
  cycles: number;
}

interface NewBilling {
  billingName: string;
  customerName: string;
  email: string;
  phone: string;
  amount: number;
  frequency: string;
  startDate: string;
  address: string;
  description: string;
}

interface BillingDetails {
  id: string;
  description: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  amount: number;
  frequency: string;
  startDate: string;
  lastBilled: string;
  nextBilling: string;
  totalBilled: number;
  cycles: number;
  billingDescription: string;
  status: 'active' | 'paused' | 'cancelled';
}

@Component({
  selector: 'app-recurring-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.css']
})
export class RecurringBillingComponent {
  pageTitle = 'Recurring Billing';
  pageSubtitle = 'Manage subscription and recurring payment schedules';

  // Summary cards
  billingSummary: BillingSummary[] = [
    { label: 'Active Subscriptions', value: 4, icon: 'repeat', color: 'pink' },
    { label: 'Monthly Revenue', value: '$750', icon: 'dollar', color: 'green' },
    { label: 'Total Customers', value: 6, icon: 'users', color: 'blue' },
    { label: 'Total Billed', value: '$12,794', icon: 'trending-up', color: 'yellow' }
  ];

  // Recurring billings data
  recurringBillings: RecurringBilling[] = [
    {
      id: 'REC-001',
      description: 'Monthly Service Fee',
      customer: 'ABC Retailers Ltd',
      amount: 250.00,
      frequency: 'Monthly',
      nextBilling: '2024-02-01',
      status: 'active',
      totalBilled: 3000,
      cycles: 12
    },
    {
      id: 'REC-002',
      description: 'Premium Support Plan',
      customer: 'Metro Supermarket',
      amount: 500.00,
      frequency: 'Monthly',
      nextBilling: '2024-02-05',
      status: 'active',
      totalBilled: 4500,
      cycles: 9
    },
    {
      id: 'REC-003',
      description: 'Annual License',
      customer: 'City Pharmacy',
      amount: 1200.00,
      frequency: 'Yearly',
      nextBilling: '2024-06-15',
      status: 'active',
      totalBilled: 2400,
      cycles: 2
    },
    {
      id: 'REC-004',
      description: 'Equipment Lease',
      customer: 'Hardware Supplies Co',
      amount: 150.00,
      frequency: 'Monthly',
      nextBilling: '2024-02-10',
      status: 'paused',
      totalBilled: 900,
      cycles: 6
    },
    {
      id: 'REC-005',
      description: 'Basic Plan',
      customer: 'Food Court Express',
      amount: 99.00,
      frequency: 'Monthly',
      nextBilling: 'N/A',
      status: 'cancelled',
      totalBilled: 594,
      cycles: 6
    },
    {
      id: 'REC-006',
      description: 'Quarterly Maintenance',
      customer: 'Electronics Hub',
      amount: 350.00,
      frequency: 'Quarterly',
      nextBilling: '2024-04-01',
      status: 'active',
      totalBilled: 1400,
      cycles: 4
    }
  ];

  // Modal states
  showCreateModal = false;
  showDetailsModal = false;
  selectedBilling: BillingDetails | null = null;

  // New billing form
  newBilling: NewBilling = {
    billingName: '',
    customerName: '',
    email: '',
    phone: '',
    amount: 0,
    frequency: 'Monthly',
    startDate: '',
    address: '',
    description: ''
  };

  searchBillings(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    console.log('Searching for:', searchTerm);
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.resetNewBilling();
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createBilling(): void {
    console.log('Creating billing:', this.newBilling);
    this.showCreateModal = false;
    // Add logic to create billing
  }

  resetNewBilling(): void {
    this.newBilling = {
      billingName: '',
      customerName: '',
      email: '',
      phone: '',
      amount: 0,
      frequency: 'Monthly',
      startDate: '',
      address: '',
      description: ''
    };
  }

  viewBillingDetails(billing: RecurringBilling): void {
    // Mock detailed data - in real app, fetch from API
    this.selectedBilling = {
      id: billing.id,
      description: billing.description,
      customer: billing.customer,
      email: 'accounts@abcretailers.com',
      phone: '+263 77 123 4567',
      address: '123 Main Street, Harare',
      amount: billing.amount,
      frequency: billing.frequency,
      startDate: '2023-01-01',
      lastBilled: '2024-01-01',
      nextBilling: billing.nextBilling,
      totalBilled: billing.totalBilled,
      cycles: billing.cycles,
      billingDescription: 'Monthly payment processing service fee',
      status: billing.status
    };
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedBilling = null;
  }

  editBilling(): void {
    console.log('Editing billing:', this.selectedBilling);
    // Add edit logic
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getFrequencyClass(frequency: string): string {
    return `frequency-${frequency.toLowerCase()}`;
  }
}