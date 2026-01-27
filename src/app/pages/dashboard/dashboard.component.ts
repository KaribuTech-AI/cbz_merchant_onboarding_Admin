import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('chartContainer') chartContainer!: ElementRef;

  // Stats data
  stats = [
    {
      title: 'Active Merchants',
      value: '2,847',
      change: '+12.5% from last month',
      positive: true,
      iconType: 'merchant'
    },
    {
      title: 'Daily Transactions',
      value: '48,294',
      change: '+8.2% from yesterday',
      positive: true,
      iconType: 'transaction'
    },
    {
      title: 'Total Volume (USD)',
      value: '$2.4M',
      change: '+15.3% from last week',
      positive: true,
      iconType: 'volume'
    },
    {
      title: 'Active Disputes',
      value: '23',
      change: '-4.1% from last month',
      positive: false,
      iconType: 'dispute'
    }
  ];

  // Chart data
  chartData = [
    { month: 'Jan', value: 12500 },
    { month: 'Feb', value: 13200 },
    { month: 'Mar', value: 14100 },
    { month: 'Apr', value: 13800 },
    { month: 'May', value: 14500 },
    { month: 'Jun', value: 15200 },
    { month: 'Jul', value: 16800 },
    { month: 'Aug', value: 17100 },
    { month: 'Sep', value: 18200 },
    { month: 'Oct', value: 17800 },
    { month: 'Nov', value: 18500 },
    { month: 'Dec', value: 19200 }
  ];

  // Channel distribution data
  channelData = [
    { name: 'POS', value: 56320 },
    { name: 'E-Commerce', value: 38450 },
    { name: 'Mobile', value: 24180 },
    { name: 'QR', value: 15680 }
  ];

  maxChannelValue: number = 60000;

  // Recent transactions
  recentTransactions = [
    {
      name: 'Spar Supermarket',
      id: 'TXN001 - POS',
      amount: '$2450.00',
      status: 'completed',
      type: 'merchant'
    },
    {
      name: 'OK Zimbabwe',
      id: 'TXN002 - E-Commerce',
      amount: '$1890.50',
      status: 'completed',
      type: 'ecommerce'
    },
    {
      name: 'TM Pick n Pay',
      id: 'TXN003 - POS',
      amount: '$3200.00',
      status: 'pending',
      type: 'pos'
    },
    {
      name: 'Econet Shop',
      id: 'TXN004 - QR',
      amount: '$450.00',
      status: 'completed',
      type: 'qr'
    },
    {
      name: 'Chicken Inn',
      id: 'TXN005 - Mobile',
      amount: '$125.00',
      status: 'failed',
      type: 'mobile'
    }
  ];

  // Alerts
  alerts = [
    {
      title: 'Suspicious transaction pattern detected',
      description: 'Unknown Vendor',
      time: '5 min ago',
      type: 'warning'
    },
    {
      title: 'KYC documents expiring soon',
      description: 'Metro Peech',
      time: '1 hour ago',
      type: 'info'
    },
    {
      title: 'Settlement delay - Bank processing',
      description: 'Multiple',
      time: '2 hours ago',
      type: 'success'
    }
  ];

  // Chart configuration
  chartWidth = 800;
  chartHeight = 300;
  chartPadding = 50;
  linePath = '';
  gridLinesY: number[] = [];
  gridLinesX: number[] = [];
  yAxisLabels: string[] = ['26000', '19500', '13000', '6500', '0'];

  // Tooltip
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: any = null;

  ngOnInit(): void {
    this.calculateMaxChannelValue();
    this.generateChartPath();
    this.generateGridLines();
  }

  calculateMaxChannelValue(): void {
    this.maxChannelValue = Math.max(...this.channelData.map(c => c.value)) * 1.1;
  }

  generateChartPath(): void {
    const points = this.chartData.map((data, index) => {
      const x = this.getX(index);
      const y = this.getY(data.value);
      return `${x},${y}`;
    });
    
    this.linePath = `M ${points.join(' L ')}`;
  }

  generateGridLines(): void {
    // Horizontal grid lines (Y-axis)
    const yLines = 5;
    this.gridLinesY = [];
    for (let i = 0; i < yLines; i++) {
      const y = this.chartPadding + (i * (this.chartHeight - 2 * this.chartPadding) / (yLines - 1));
      this.gridLinesY.push(y);
    }

    // Vertical grid lines (X-axis)
    this.gridLinesX = this.chartData.map((_, index) => this.getX(index));
  }

  getX(index: number): number {
    const availableWidth = this.chartWidth - 2 * this.chartPadding;
    const stepX = availableWidth / (this.chartData.length - 1);
    return this.chartPadding + index * stepX;
  }

  getY(value: number): number {
    const minValue = 0;
    const maxValue = 26000;
    const availableHeight = this.chartHeight - 2 * this.chartPadding;
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    return this.chartHeight - this.chartPadding - (normalizedValue * availableHeight);
  }

  showTooltip(event: MouseEvent, data: any, index: number): void {
    this.tooltipVisible = true;
    this.tooltipData = data;
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const containerRect = this.chartContainer?.nativeElement?.getBoundingClientRect();
    
    if (containerRect) {
      this.tooltipX = rect.left - containerRect.left + 10;
      this.tooltipY = rect.top - containerRect.top - 40;
    }
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }
}