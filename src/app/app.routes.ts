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
            .then(m => m.DashboardComponent)
      },

      {
        path: 'merchants',
        children: [
          { path: '', redirectTo: 'all', pathMatch: 'full' },
          {
            path: 'all',
            loadComponent: () =>
              import('./pages/merchants/merchants.component')
                .then(m => m.MerchantsComponent)
          },
          {
            path: 'onboarding',
            loadComponent: () =>
              import('./pages/merchants/onboarding/onboarding.component')
                .then(m => m.OnboardingComponent)
          },
          {
            path: 'lifecycle',
            loadComponent: () =>
              import('./pages/merchants/lifecycle/lifecycle.component')
                .then(m => m.LifecycleComponent)
          }
        ]
      },

      {
        path: 'transactions',
        children: [
          { path: '', redirectTo: 'all', pathMatch: 'full' },
          {
            path: 'all',
            loadComponent: () =>
              import('./pages/transactions/all-transactions/all-transactions.component')
                .then(m => m.AllTransactionsComponent)
          },
          {
            path: 'settlement',
            loadComponent: () =>
              import('./pages/transactions/settlement/settlement.component')
                .then(m => m.SettlementComponent)
          }
        ]
      },

      {
        path: 'payment-channels',
        loadComponent: () =>
          import('./pages/payment-channels/payment-channels.component')
            .then(m => m.PaymentChannelsComponent)
      },

      {
        path: 'risk-compliance',
        loadComponent: () =>
          import('./pages/risk-compliance/risk-compliance.component')
            .then(m => m.RiskComplianceComponent)
      },

      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports.component')
            .then(m => m.ReportsComponent)
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./pages/settings/settings.component')
            .then(m => m.SettingsComponent)
      }
    ]
  }
];