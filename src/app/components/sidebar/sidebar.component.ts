import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  activeMerchantsSubmenu = false;
  activeTransactionsSubmenu = false;
  activePaymentChannelsSubmenu = false;
  activeBillingSubmenu = false;
  activeRiskComplianceSubmenu = false;

  menuItems = [
    { 
      name: 'Dashboard', 
      icon: 'dashboard',
      route: '/dashboard',
      hasSubmenu: false
    },
    { 
      name: 'Merchants', 
      icon: 'merchants',
      route: '/merchants',
      hasSubmenu: true,
      submenu: [
        { name: 'All Merchants', route: '/merchants/all' },
        { name: 'Onboarding', route: '/merchants/onboarding' },
        { name: 'Lifecycle', route: '/merchants/lifecycle' }
      ]
    },
    { 
      name: 'Transactions', 
      icon: 'transactions',
      route: '/transactions',
      hasSubmenu: true,
      submenu: [
        { name: 'All Transactions', route: '/transactions/all' },
        { name: 'Settlement', route: '/transactions/settlement' }
      ]
    },
    { 
      name: 'Payment Channels', 
      icon: 'payment',
      route: '/payment-channels',
      hasSubmenu: true,
      submenu: [
        { name: 'POS Terminals', route: '/payment-channels/pos-terminals' },
        { name: 'E-Commerce', route: '/payment-channels/ecommerce' },
        { name: 'QR Payments', route: '/payment-channels/qr-payments' }
      ]
    },
    { 
      name: 'Billing & Invoicing', 
      icon: 'billing',
      route: '/billing',
      hasSubmenu: true,
      submenu: [
        { name: 'Invoices', route: '/billing/invoices' },
        { name: 'Payment History', route: '/billing/payment-history' },
        { name: 'Statements', route: '/billing/statements' },
        { name: 'Recurring Billing', route: '/billing/recurring', isHighlight: true }
      ]
    },
    { 
      name: 'Risk & Compliance', 
      icon: 'risk',
      route: '/risk-compliance',
      hasSubmenu: true,
      submenu: [
        { name: 'Disputes', route: '/risk-compliance/disputes' },
        { name: 'Fraud Detection', route: '/risk-compliance/fraud-detection' },
        { name: 'Compliance', route: '/risk-compliance/compliance' }
      ]
    },
    { 
      name: 'Reports', 
      icon: 'reports',
      route: '/reports',
      hasSubmenu: false
    }
  ];

  // Settings at the bottom (separate from main menu)
  settingsItem = { 
    name: 'Settings', 
    icon: 'settings',
    route: '/settings',
    hasSubmenu: false
  };

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  toggleSubmenu(menuName: string): void {
    if (menuName === 'Merchants') {
      this.activeMerchantsSubmenu = !this.activeMerchantsSubmenu;
    } else if (menuName === 'Transactions') {
      this.activeTransactionsSubmenu = !this.activeTransactionsSubmenu;
    } else if (menuName === 'Payment Channels') {
      this.activePaymentChannelsSubmenu = !this.activePaymentChannelsSubmenu;
    } else if (menuName === 'Billing & Invoicing') {
      this.activeBillingSubmenu = !this.activeBillingSubmenu;
    } else if (menuName === 'Risk & Compliance') {
      this.activeRiskComplianceSubmenu = !this.activeRiskComplianceSubmenu;
    }
  }

  isSubmenuOpen(menuName: string): boolean {
    if (menuName === 'Merchants') return this.activeMerchantsSubmenu;
    if (menuName === 'Transactions') return this.activeTransactionsSubmenu;
    if (menuName === 'Payment Channels') return this.activePaymentChannelsSubmenu;
    if (menuName === 'Billing & Invoicing') return this.activeBillingSubmenu;
    if (menuName === 'Risk & Compliance') return this.activeRiskComplianceSubmenu;
    return false;
  }
}