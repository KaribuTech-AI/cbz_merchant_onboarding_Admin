import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        data: {
          title: 'Dashboard',
          subtitle: 'Overview of merchant acquiring operations'
        }
      },

      {
        path: 'merchants',
        children: [
          {
            path: '',
            redirectTo: 'all',
            pathMatch: 'full'
          },
          {
            path: 'all',
            loadComponent: () =>
              import('./pages/merchants/merchants.component')
                .then(m => m.MerchantsComponent),
            data: {
              title: 'All Merchants',
              subtitle: 'Registered merchants'
            }
          },
          {
            path: 'onboarding',
            loadComponent: () =>
              import('./pages/merchants/onboarding/onboarding.component')
                .then(m => m.OnboardingComponent),
            data: {
              title: 'Merchant Onboarding',
              subtitle: 'New merchant registrations'
            }
          },
          {
            path: 'lifecycle',
            loadComponent: () =>
              import('./pages/merchants/lifecycle/lifecycle.component')
                .then(m => m.LifecycleComponent),
            data: {
              title: 'Merchant Lifecycle',
              subtitle: 'Merchant status and lifecycle management'
            }
          }
        ]
      },

    

      {
        path: 'transactions',
        children: [
          {
            path: '',
            redirectTo: 'all',
            pathMatch: 'full'
          },
          {
            path: 'all',
            loadComponent: () =>
              import('./pages/transactions/all-transactions/all-transactions.component')
                .then(m => m.AllTransactionsComponent),
            data: {
              title: 'All Transactions',
              subtitle: 'Transaction history'
            }
          },
          {
            path: 'settlement',
            loadComponent: () =>
              import('./pages/transactions/settlement/settlement.component')
                .then(m => m.SettlementComponent),
            data: {
              title: 'Settlements',
              subtitle: 'Transaction settlements'
            }
          }
        ]
      },

      {
        path: 'payment-channels',
        children: [
          { path: '', redirectTo: 'pos-terminals', pathMatch: 'full' },
          {
            path: 'pos-terminals',
            loadComponent: () =>
              import('./pages/payment-channels/pos-terminals/pos-terminals.component')
                .then(m => m.PosTerminalsComponent),
            data: {
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
              title: 'POS Terminals',
              subtitle: 'Manage POS terminals'
            }
          },
          {
            path: 'ecommerce',
            loadComponent: () =>
              import('./pages/payment-channels/e-commerce/e-commerce.component')
                .then(m => m.ECommerceComponent),
            data: {
              title: 'E-Commerce',
              subtitle: 'Online payment channels'
            }
          },
          {
            path: 'qr-payments',
            loadComponent: () =>
              import('./pages/payment-channels/qr-payments/qr-payments.component')
                .then(m => m.QrPaymentsComponent),
            data: {
              title: 'QR Payments',
              subtitle: 'QR-based payment transactions'
            }
          }
        ]
      },

      {
        path: 'billing',
        children: [
          { path: '', redirectTo: 'invoices', pathMatch: 'full' },
          {
            path: 'invoices',
            loadComponent: () =>
              import('./pages/billing-and-invoices/invoices/invoices.component')
                .then(m => m.InvoicesComponent),
            data: {
              title: 'Invoices',
              subtitle: 'Manage customer invoices'
            }
          },
          {
            path: 'payment-history',
            loadComponent: () =>
              import('./pages/billing-and-invoices/payment-history/payment-history.component')
                .then(m => m.PaymentHistoryComponent),
            data: {
              title: 'Payment History',
              subtitle: 'View payment transaction history'
            }
          },
          {
            path: 'statements',
            loadComponent: () =>
              import('./pages/billing-and-invoices/statements/statements.component')
                .then(m => m.StatementsComponent),
            data: {
              title: 'Statements',
              subtitle: 'Monthly billing statements'
            }
          },
          {
            path: 'recurring',
            loadComponent: () =>
              import('./pages/billing-and-invoices/recurring/recurring.component')
                .then(m => m.RecurringBillingComponent),
            data: {
              title: 'Recurring Billing',
              subtitle: 'Manage recurring payment schedules'
            }
          }
        ]
      },

      {
        path: 'risk-compliance',
        children: [
          { path: '', redirectTo: 'disputes', pathMatch: 'full' },
          {
            path: 'disputes',
            loadComponent: () =>
              import('./pages/risk-compliance/disputes/disputes.component')
                .then(m => m.DisputesComponent),
            data: {
              title: 'Disputes',
              subtitle: 'Active transaction disputes'
            }
          },
          {
            path: 'fraud-detection',
            loadComponent: () =>
              import('./pages/risk-compliance/fraud-detection/fraud-detection.component')
                .then(m => m.FraudDetectionComponent),
            data: {
              title: 'Fraud Detection',
              subtitle: 'Suspicious transaction monitoring'
            }
          },
          {
            path: 'compliance',
            loadComponent: () =>
              import('./pages/risk-compliance/compliance/compliance.component')
                .then(m => m.ComplianceComponent),
            data: {
              title: 'Compliance',
              subtitle: 'Regulatory compliance status'
            }
          }
        ]
      },

      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports.component')
            .then(m => m.ReportsComponent),
        data: {
          title: 'Reports',
          subtitle: 'Analytics and insights'
        }
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component')
            .then(m => m.SettingsComponent),
        data: {
          title: 'Settings',
          subtitle: 'System configuration'
        }
      }
    ]
  }
];