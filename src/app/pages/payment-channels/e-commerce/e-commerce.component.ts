import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Merchant {
  name: string;
  url: string;
  status: 'active' | 'testing' | 'suspended';
  ssl: 'valid' | 'expired';
  pci: 'compliant' | 'pending' | 'non-compliant';
  dailyVolume: number;
  successRate: number;
  responseTime: string;
  cards: string[];
}

interface ApiActivity {
  timestamp: string;
  merchant: string;
  endpoint: string;
  method: string;
  status: number;
  duration: string;
}

interface ChartDataPoint {
  time: string;
  value: number;
}

@Component({
  selector: 'app-e-commerce',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.css']
})
export class ECommerceComponent {
  activeIntegrations = 4;
  activeIntegrationsChange = '+3 this month';
  
  dailyVolume = 175890;
  dailyVolumeChange = '+12.5% vs yesterday';
  
  dailyTransactions = 510;
  successRate = 99.2;
  
  avgResponseTime = 256;
  responseTimeChange = '-8ms improvement';
  
  searchQuery = '';
  selectedFilter = 'All';
  filters = ['All', 'Active', 'Testing', 'Suspended'];
  
  merchants: Merchant[] = [
    {
      name: 'ZimTech Online Store',
      url: 'www.zimtech.co.zw',
      status: 'active',
      ssl: 'valid',
      pci: 'compliant',
      dailyVolume: 45890,
      successRate: 98.5,
      responseTime: '245ms',
      cards: ['Visa', 'Mastercard', 'Zimswitch']
    },
    {
      name: 'Fashion Hub Zimbabwe',
      url: 'www.fashionhub.co.zw',
      status: 'active',
      ssl: 'valid',
      pci: 'compliant',
      dailyVolume: 32450,
      successRate: 97.2,
      responseTime: '312ms',
      cards: ['Visa', 'Mastercard']
    },
    {
      name: 'Grocery Express',
      url: 'www.groceryexpress.co.zw',
      status: 'testing',
      ssl: 'valid',
      pci: 'pending',
      dailyVolume: 0,
      successRate: 0,
      responseTime: 'N/A',
      cards: ['Visa', 'Mastercard', 'Zimswitch']
    },
    {
      name: 'AutoParts Direct',
      url: 'www.autoparts.co.zw',
      status: 'suspended',
      ssl: 'expired',
      pci: 'non-compliant',
      dailyVolume: 0,
      successRate: 0,
      responseTime: 'N/A',
      cards: ['Visa']
    },
    {
      name: 'Book Haven',
      url: 'www.bookhaven.co.zw',
      status: 'active',
      ssl: 'valid',
      pci: 'compliant',
      dailyVolume: 18900,
      successRate: 99.1,
      responseTime: '198ms',
      cards: ['Visa', 'Mastercard', 'Zimswitch']
    },
    {
      name: 'Electronics World',
      url: 'www.electronicsworld.co.zw',
      status: 'active',
      ssl: 'valid',
      pci: 'compliant',
      dailyVolume: 78650,
      successRate: 96.8,
      responseTime: '287ms',
      cards: ['Visa', 'Mastercard']
    }
  ];
  
  apiActivities: ApiActivity[] = [
    {
      timestamp: '2024-01-15 14:32:15',
      merchant: 'ZimTech',
      endpoint: '/v1/charges',
      method: 'POST',
      status: 200,
      duration: '234ms'
    },
    {
      timestamp: '2024-01-15 14:32:10',
      merchant: 'Fashion Hub',
      endpoint: '/v1/charges',
      method: 'POST',
      status: 200,
      duration: '312ms'
    },
    {
      timestamp: '2024-01-15 14:31:58',
      merchant: 'Book Haven',
      endpoint: '/v1/refunds',
      method: 'POST',
      status: 200,
      duration: '456ms'
    },
    {
      timestamp: '2024-01-15 14:31:45',
      merchant: 'Electronics World',
      endpoint: '/v1/charges',
      method: 'POST',
      status: 402,
      duration: '189ms'
    },
    {
      timestamp: '2024-01-15 14:31:30',
      merchant: 'ZimTech',
      endpoint: '/v1/charges',
      method: 'POST',
      status: 200,
      duration: '267ms'
    }
  ];
  
  chartData: ChartDataPoint[] = [
    { time: '00:00', value: 10000 },
    { time: '04:00', value: 8000 },
    { time: '08:00', value: 25000 },
    { time: '12:00', value: 60000 },
    { time: '16:00', value: 95000 },
    { time: '20:00', value: 50000 },
    { time: '23:59', value: 20000 }
  ];
  
  get filteredMerchants(): Merchant[] {
    let filtered = this.merchants;
    
    if (this.selectedFilter !== 'All') {
      filtered = filtered.filter(m => 
        m.status.toLowerCase() === this.selectedFilter.toLowerCase()
      );
    }
    
    if (this.searchQuery) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }
  
  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }
  
  getSuccessRateWidth(rate: number): string {
    return rate > 0 ? `${rate}%` : '0%';
  }
  
  getStatusClass(status: string): string {
    return `status-${status}`;
  }
  
  getMethodClass(status: number): string {
    return status === 200 ? 'method-success' : 'method-error';
  }
  
  formatVolume(volume: number): string {
    return `$${volume.toLocaleString()}`;
  }
  
  getChartPath(): string {
    const width = 1200;
    const height = 200;
    const padding = 20;
    
    const maxValue = Math.max(...this.chartData.map(d => d.value));
    const xStep = (width - 2 * padding) / (this.chartData.length - 1);
    
    let path = '';
    
    this.chartData.forEach((point, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((point.value / maxValue) * (height - 2 * padding));
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  }
}