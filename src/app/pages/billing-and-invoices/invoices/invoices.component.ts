import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Invoice {
  id: string;
  customer: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'draft';
  dueDate: string;
  created: string;
  items?: InvoiceItem[];
  notes?: string;
}

interface InvoiceItem {
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {
  // Stats
  totalInvoices = 6;
  pendingAmount = 6950;
  overdue = 3200;
  paidMTD = 2781.25;
  
  // Modals
  showCreateModal = false;
  showDetailsModal = false;
  selectedInvoice: Invoice | null = null;
  
  // Form data
  customerName = '';
  customerEmail = '';
  customerPhone = '';
  customerAddress = '';
  dueDate = '';
  invoiceNotes = '';
  invoiceItems: InvoiceItem[] = [
    { description: '', qty: 1, rate: 0, amount: 0 }
  ];
  
  searchQuery = '';
  
  invoices: Invoice[] = [
    {
      id: 'INV-2024-001',
      customer: 'ABC Retailers Ltd',
      customerEmail: 'accounts@abcretailers.com',
      customerPhone: '+263 77 123 4567',
      customerAddress: '123 Main Street, Harare',
      amount: 2450.00,
      status: 'pending',
      dueDate: '2024-02-15',
      created: '2024-01-15',
      items: [
        { description: 'POS Terminal Rental', qty: 2, rate: 500.00, amount: 1000.00 },
        { description: 'Transaction Processing Fee', qty: 1, rate: 1450.00, amount: 1450.00 }
      ],
      notes: 'Payment due within 30 days'
    },
    {
      id: 'INV-2024-002',
      customer: 'Metro Supermarket',
      customerEmail: 'billing@metrosuper.com',
      customerPhone: '+263 77 234 5678',
      customerAddress: '456 Sam Nujoma Street, Harare',
      amount: 1890.50,
      status: 'paid',
      dueDate: '2024-01-31',
      created: '2024-01-10',
      items: [
        { description: 'Monthly Service Fee', qty: 1, rate: 1890.50, amount: 1890.50 }
      ]
    },
    {
      id: 'INV-2024-003',
      customer: 'City Pharmacy',
      customerEmail: 'finance@citypharmacy.com',
      customerPhone: '+263 77 345 6789',
      customerAddress: '789 Robert Mugabe Road, Harare',
      amount: 3200.00,
      status: 'overdue',
      dueDate: '2024-01-20',
      created: '2024-01-05',
      items: [
        { description: 'Terminal Maintenance', qty: 4, rate: 800.00, amount: 3200.00 }
      ]
    },
    {
      id: 'INV-2024-004',
      customer: 'Hardware Supplies Co',
      customerEmail: 'ap@hardwaresupplies.com',
      customerPhone: '+263 77 456 7890',
      customerAddress: '321 Kwame Nkrumah Ave, Harare',
      amount: 890.75,
      status: 'paid',
      dueDate: '2024-01-25',
      created: '2024-01-08',
      items: [
        { description: 'Transaction Fees', qty: 1, rate: 890.75, amount: 890.75 }
      ]
    },
    {
      id: 'INV-2024-005',
      customer: 'Food Court Express',
      customerEmail: 'accounts@foodcourt.com',
      customerPhone: '+263 77 567 8901',
      customerAddress: '654 Julius Nyerere Way, Harare',
      amount: 1567.25,
      status: 'draft',
      dueDate: '2024-02-20',
      created: '2024-01-18',
      items: [
        { description: 'Setup Fee', qty: 1, rate: 1567.25, amount: 1567.25 }
      ]
    },
    {
      id: 'INV-2024-006',
      customer: 'Electronics Hub',
      customerEmail: 'billing@electronicshub.com',
      customerPhone: '+263 77 678 9012',
      customerAddress: '987 Samora Machel Ave, Harare',
      amount: 4500.00,
      status: 'pending',
      dueDate: '2024-02-10',
      created: '2024-01-12',
      items: [
        { description: 'POS Terminals (3 units)', qty: 3, rate: 1500.00, amount: 4500.00 }
      ]
    }
  ];
  
  get filteredInvoices(): Invoice[] {
    if (!this.searchQuery) {
      return this.invoices;
    }
    
    return this.invoices.filter(invoice =>
      invoice.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      invoice.customerEmail.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  
  get totalAmount(): number {
    return this.invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  }
  
  openCreateModal(): void {
    this.showCreateModal = true;
    this.resetForm();
  }
  
  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }
  
  openDetailsModal(invoice: Invoice): void {
    this.selectedInvoice = invoice;
    this.showDetailsModal = true;
  }
  
  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedInvoice = null;
  }
  
  addInvoiceItem(): void {
    this.invoiceItems.push({ description: '', qty: 1, rate: 0, amount: 0 });
  }
  
  removeInvoiceItem(index: number): void {
    if (this.invoiceItems.length > 1) {
      this.invoiceItems.splice(index, 1);
    }
  }
  
  updateItemAmount(item: InvoiceItem): void {
    item.amount = item.qty * item.rate;
  }
  
  createInvoice(): void {
    if (this.customerName && this.customerEmail && this.dueDate) {
      const newInvoice: Invoice = {
        id: `INV-2024-${String(this.invoices.length + 1).padStart(3, '0')}`,
        customer: this.customerName,
        customerEmail: this.customerEmail,
        customerPhone: this.customerPhone,
        customerAddress: this.customerAddress,
        amount: this.totalAmount,
        status: 'draft',
        dueDate: this.dueDate,
        created: new Date().toISOString().split('T')[0],
        items: [...this.invoiceItems],
        notes: this.invoiceNotes
      };
      
      this.invoices.unshift(newInvoice);
      this.closeCreateModal();
    }
  }
  
  downloadPDF(invoice: Invoice): void {
    console.log('Downloading PDF for:', invoice.id);
    // PDF download logic here
  }
  
  resetForm(): void {
    this.customerName = '';
    this.customerEmail = '';
    this.customerPhone = '';
    this.customerAddress = '';
    this.dueDate = '';
    this.invoiceNotes = '';
    this.invoiceItems = [{ description: '', qty: 1, rate: 0, amount: 0 }];
  }
  
  formatAmount(amount: number): string {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}