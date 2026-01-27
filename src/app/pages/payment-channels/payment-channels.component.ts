// payment-channels.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-channels',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1>Payment Channels</h1>
      <p>Manage POS terminals, e-commerce, and QR payment systems.</p>
      <div class="content-card">
        <h3>Channel Management</h3>
        <p>Configure and monitor all payment channel operations.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1400px; }
    h1 { font-size: 28px; color: #1a202c; font-weight: 600; margin-bottom: 8px; }
    p { color: #718096; margin-bottom: 24px; }
    .content-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    .content-card h3 { font-size: 18px; color: #1a202c; margin-bottom: 12px; }
  `]
})
export class PaymentChannelsComponent {}
