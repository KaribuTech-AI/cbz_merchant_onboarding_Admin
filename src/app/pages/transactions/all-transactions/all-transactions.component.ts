import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transaction {
  id: string;
  merchant: string;
  merchantCode: string;
  type: string;
  channel: string;
  cardType: string;
  amount: number;
  fee: number;
  status: 'completed' | 'pending' | 'failed' | 'refund';
  timestamp: string;
}

interface ChartDataPoint {
  time: string;
  value: number;
}

@Component({
  selector: 'app-all-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.css']
})
export class AllTransactionsComponent implements OnInit {
  // Summary metrics
  todayTransactions = 48294;
  transactionChange = '+8.2%';
  totalVolume = 15910.75;
  volumeChange = '15.3%';
  feeRevenue = 151.31;
  revenueChange = '12.8%';
  successRate = 98.4;
  successChange = '-0.3%';

  // Chart data
  chartData: ChartDataPoint[] = [];
  hoveredPoint: ChartDataPoint | null = null;

  // Transactions
  transactions: Transaction[] = [
    {
      id: 'TXN248115001',
      merchant: 'Spar Supermarket',
      merchantCode: 'MER001',
      type: 'purchase',
      channel: 'POS',
      cardType: 'Visa',
      amount: 2450.00,
      fee: 24.50,
      status: 'completed',
      timestamp: '2024-01-15 14:32:18'
    },
    {
      id: 'TXN248115002',
      merchant: 'OK Zimbabwe',
      merchantCode: 'MER002',
      type: 'purchase',
      channel: 'E-Commerce',
      cardType: 'Mastercard',
      amount: 1890.50,
      fee: 18.91,
      status: 'completed',
      timestamp: '2024-01-15 14:28:45'
    },
    {
      id: 'TXN248115003',
      merchant: 'TM Pick n Pay',
      merchantCode: 'MER003',
      type: 'purchase',
      channel: 'POS',
      cardType: 'Visa',
      amount: 3200.00,
      fee: 32.00,
      status: 'pending',
      timestamp: '2024-01-15 14:25:12'
    },
    {
      id: 'TXN248115004',
      merchant: 'Econet Shop',
      merchantCode: 'MER004',
      type: 'purchase',
      channel: 'QR',
      cardType: 'Mobile Wallet',
      amount: 450.00,
      fee: 4.50,
      status: 'completed',
      timestamp: '2024-01-15 14:20:33'
    },
    {
      id: 'TXN248115005',
      merchant: 'Chicken Inn',
      merchantCode: 'MER005',
      type: 'refund',
      channel: 'Mobile',
      cardType: 'Visa',
      amount: -125.00,
      fee: 0.00,
      status: 'completed',
      timestamp: '2024-01-15 14:15:08'
    },
    {
      id: 'TXN248115006',
      merchant: 'Zuva Petroleum',
      merchantCode: 'MER007',
      type: 'purchase',
      channel: 'POS',
      cardType: 'Mastercard',
      amount: 5890.00,
      fee: 58.90,
      status: 'completed',
      timestamp: '2024-01-15 14:10:22'
    },
    {
      id: 'TXN248115007',
      merchant: 'Spar Supermarket',
      merchantCode: 'MER001',
      type: 'purchase',
      channel: 'POS',
      cardType: 'Visa',
      amount: 780.25,
      fee: 0.00,
      status: 'failed',
      timestamp: '2024-01-15 14:05:47'
    },
    {
      id: 'TXN248115008',
      merchant: 'Innscor',
      merchantCode: 'MER008',
      type: 'purchase',
      channel: 'E-Commerce',
      cardType: 'American Express',
      amount: 1250.00,
      fee: 12.50,
      status: 'completed',
      timestamp: '2024-01-15 14:00:15'
    }
  ];

  searchTerm = '';
  statusFilter = 'All Status';
  channelFilter = 'All Channels';

  // Expose Math to template
  Math = Math;

  ngOnInit() {
    this.generateChartData();
  }

  generateChartData() {
    const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    const values = [12000, 11500, 13000, 15000, 20000, 28000, 38000, 42000, 40000, 36000, 32000, 28400];
    
    this.chartData = hours.map((time, index) => ({
      time,
      value: values[index]
    }));
  }

  onChartHover(point: ChartDataPoint) {
    this.hoveredPoint = point;
  }

  clearHover() {
    this.hoveredPoint = null;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getChangeClass(change: string): string {
    return change.startsWith('+') || !change.startsWith('-') ? 'positive' : 'negative';
  }

  // Helper methods for chart
  getChartPoints(isRedLine: boolean): string {
    return this.chartData.map((p, i) => {
      const x = (i * 90) + 40;
      const y = isRedLine 
        ? 200 - (p.value / 60000 * 150)
        : 200 - ((p.value * 0.85) / 60000 * 150);
      return `${x},${y}`;
    }).join(' ');
  }

  getPointX(index: number): number {
    return (index * 90) + 40;
  }

  getPointY(value: number): number {
    return 200 - (value / 60000 * 150);
  }
}