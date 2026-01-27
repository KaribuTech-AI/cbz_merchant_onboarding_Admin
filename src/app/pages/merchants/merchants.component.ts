import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Merchant {
  id: string;
  businessName: string;
  tradingName: string;
  category: string;
  segment: string;
  status: string;
  riskTier: string;
  channels: string[];
  monthlyVolume: string;
  since?: string;
  monthlyTxns?: string;
  terminals?: string;
  chargebackRate?: string;
  registrationNo?: string;
  taxId?: string;
  employees?: string;
  locations?: string;
  settlementAccount?: string;
  settlementCycle?: string;
  feeRate?: string;
  avgTxnValue?: string;
  openDisputes?: string;
  lastActivity?: string;
  contactPerson?: {
    initials: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    address: string;
  };
  recentTransactions?: Array<{
    type: string;
    date: string;
    channel: string;
    amount: string;
    status: string;
  }>;
}

@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchants.component.html',
  styleUrls: ['./merchants.component.css']
})
export class MerchantsComponent implements OnInit {
  merchants: Merchant[] = [
    {
      id: 'MER001',
      businessName: 'Spar Supermarket',
      tradingName: 'Spar Zimbabwe',
      category: 'Retail',
      segment: 'Corporate',
      status: 'active',
      riskTier: 'Low',
      channels: ['POS', 'E-Commerce'],
      monthlyVolume: '$245,000',
      since: '2023-03-20',
      monthlyTxns: '15,234',
      terminals: '45/50',
      chargebackRate: '0.05%'
    },
    {
      id: 'MER002',
      businessName: 'OK Zimbabwe Ltd',
      tradingName: 'OK Stores',
      category: 'Retail',
      segment: 'Corporate',
      status: 'active',
      riskTier: 'Low',
      channels: ['POS', 'E-Commerce', 'Mobile'],
      monthlyVolume: '$189,000',
      since: '2023-03-20',
      monthlyTxns: '12,456',
      terminals: '34/35',
      chargebackRate: '0.08%',
      registrationNo: 'BN2018/098765',
      taxId: '1234567890',
      employees: '620',
      locations: '18',
      settlementAccount: 'CBZ ****7832',
      settlementCycle: 'T+2',
      feeRate: '1.50%',
      avgTxnValue: '$15.17',
      openDisputes: '1',
      lastActivity: '2024-01-15 14:28:00',
      contactPerson: {
        initials: 'SN',
        name: 'Sarah Ncube',
        role: 'CFO',
        email: 'finance@ok.co.zw',
        phone: '+263 77 234 5678',
        address: '45 Nelson Mandela Ave, Harare'
      },
      recentTransactions: [
        {
          type: 'Sale',
          date: '2024-01-15',
          channel: 'POS',
          amount: '$45.00',
          status: 'completed'
        },
        {
          type: 'Sale',
          date: '2024-01-15',
          channel: 'Mobile',
          amount: '$78.50',
          status: 'completed'
        },
        {
          type: 'Sale',
          date: '2024-01-15',
          channel: 'E-Commerce',
          amount: '$156.00',
          status: 'completed'
        }
      ]
    },
    {
      id: 'MER003',
      businessName: 'TM Pick n Pay',
      tradingName: 'Pick n Pay',
      category: 'Retail',
      segment: 'Corporate',
      status: 'active',
      riskTier: 'Medium',
      channels: ['POS'],
      monthlyVolume: '$320,000',
      since: '2023-01-15'
    },
    {
      id: 'MER004',
      businessName: 'Econet Wireless',
      tradingName: 'Econet Shop',
      category: 'Telecommunications',
      segment: 'Corporate',
      status: 'active',
      riskTier: 'Low',
      channels: ['POS', 'E-Commerce', 'QR'],
      monthlyVolume: '$450,000',
      since: '2022-11-10'
    },
    {
      id: 'MER005',
      businessName: 'Chicken Inn',
      tradingName: 'Chicken Inn',
      category: 'Food & Beverage',
      segment: 'SME',
      status: 'active',
      riskTier: 'Low',
      channels: ['POS', 'Mobile'],
      monthlyVolume: '$125,000',
      since: '2023-05-22'
    },
    {
      id: 'MER006',
      businessName: 'Metro Peech',
      tradingName: 'Metro',
      category: 'Retail',
      segment: 'SME',
      status: 'suspended',
      riskTier: 'High',
      channels: ['POS'],
      monthlyVolume: '$45,000',
      since: '2023-02-14'
    },
    {
      id: 'MER007',
      businessName: 'Zuva Petroleum',
      tradingName: 'Zuva Service Stations',
      category: 'Fuel & Energy',
      segment: 'Corporate',
      status: 'active',
      riskTier: 'Medium',
      channels: ['POS', 'QR'],
      monthlyVolume: '$890,000',
      since: '2022-08-05'
    },
    {
      id: 'MER008',
      businessName: 'Innscor Africa',
      tradingName: 'Innscor',
      category: 'Food & Beverage',
      segment: 'Corporate',
      status: 'under-review',
      riskTier: 'Medium',
      channels: ['POS', 'E-Commerce'],
      monthlyVolume: '$560,000',
      since: '2023-09-18'
    }
  ];

  filteredMerchants: Merchant[] = [];
  selectedMerchant: Merchant | null = null;

  // Filters
  searchTerm: string = '';
  selectedStatus: string = '';
  selectedSegment: string = '';

  // Modals
  showAddMerchantModal: boolean = false;
  showMerchantDetails: boolean = false;

  // Active tab in sidebar
  activeTab: string = 'business';

  // New merchant form
  newMerchant = {
    businessName: '',
    tradingName: '',
    category: '',
    segment: '',
    email: '',
    phone: '',
    address: '',
    channels: {
      pos: false,
      ecommerce: false,
      qr: false,
      mobile: false
    }
  };

  ngOnInit(): void {
    this.filteredMerchants = [...this.merchants];
  }

  filterMerchants(): void {
    this.filteredMerchants = this.merchants.filter(merchant => {
      const matchesSearch = !this.searchTerm || 
        merchant.businessName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        merchant.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        merchant.tradingName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.selectedStatus || merchant.status === this.selectedStatus;
      const matchesSegment = !this.selectedSegment || merchant.segment === this.selectedSegment;
      
      return matchesSearch && matchesStatus && matchesSegment;
    });
  }

  openAddMerchantModal(): void {
    this.showAddMerchantModal = true;
  }

  closeAddMerchantModal(): void {
    this.showAddMerchantModal = false;
    this.resetNewMerchantForm();
  }

  createMerchant(): void {
    // Get selected channels
    const channels: string[] = [];
    if (this.newMerchant.channels.pos) channels.push('POS');
    if (this.newMerchant.channels.ecommerce) channels.push('E-Commerce');
    if (this.newMerchant.channels.qr) channels.push('QR');
    if (this.newMerchant.channels.mobile) channels.push('Mobile');

    // Create new merchant object
    const merchant: Merchant = {
      id: `MER${String(this.merchants.length + 1).padStart(3, '0')}`,
      businessName: this.newMerchant.businessName,
      tradingName: this.newMerchant.tradingName,
      category: this.newMerchant.category,
      segment: this.newMerchant.segment,
      status: 'under-review',
      riskTier: 'Medium',
      channels: channels,
      monthlyVolume: '$0',
      since: new Date().toISOString().split('T')[0]
    };

    // Add to merchants array
    this.merchants.unshift(merchant);
    this.filterMerchants();

    // Close modal and reset form
    this.closeAddMerchantModal();

    // Show success message (you can implement a toast notification)
    console.log('Merchant created successfully:', merchant);
  }

  resetNewMerchantForm(): void {
    this.newMerchant = {
      businessName: '',
      tradingName: '',
      category: '',
      segment: '',
      email: '',
      phone: '',
      address: '',
      channels: {
        pos: false,
        ecommerce: false,
        qr: false,
        mobile: false
      }
    };
  }

  openMerchantDetails(merchant: Merchant): void {
    this.selectedMerchant = merchant;
    this.showMerchantDetails = true;
    this.activeTab = 'business';
  }

  closeMerchantDetails(): void {
    this.showMerchantDetails = false;
    this.selectedMerchant = null;
  }

  getRiskTierClass(riskTier: string | undefined): string {
    return riskTier ? riskTier.toLowerCase() : '';
  }

  toggleMerchantMenu(merchant: Merchant): void {
    // This method can be used to show a context menu for merchant actions
    // For now, we'll just open the merchant details
    this.openMerchantDetails(merchant);
  }
}