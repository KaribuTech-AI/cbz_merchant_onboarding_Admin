import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface QRCode {
  id: string;
  merchant: string;
  merchantIcon?: string;
  type: 'static' | 'dynamic';
  location: string;
  status: 'active' | 'inactive';
  dailyScans: number;
  dailyVolume: number;
  lastScan: string;
}

interface RecentScan {
  merchant: string;
  merchantIcon?: string;
  qrId: string;
  amount: number;
  timestamp: string;
}

interface ChartDataPoint {
  day: string;
  staticQR: number;
  dynamicQR: number;
}

@Component({
  selector: 'app-qr-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-payments.component.html',
  styleUrls: ['./qr-payments.component.css']
})
export class QrPaymentsComponent {
  // Stats
  activeQRCodes = 6;
  activeQRCodesChange = '+5 this week';
  
  dailyScans = 1066;
  dailyScansChange = '+18.2% vs yesterday';
  
  dailyVolume = 214150;
  dailyVolumeChange = '+22.5% growth';
  
  uniqueCustomers = 1247;
  customersNote = 'Today';
  
  // Modals
  showGenerateModal = false;
  showQRDetailsModal = false;
  selectedQRCode: QRCode | null = null;
  
  // Form data
  selectedMerchant = '';
  selectedQRType = '';
  qrLocation = '';
  
  searchQuery = '';
  selectedFilter = 'All';
  filters = ['All', 'Static QR', 'Dynamic QR', 'Inactive'];
  
  qrCodes: QRCode[] = [
    {
      id: 'QR001',
      merchant: 'Spar Avondale',
      type: 'static',
      location: 'Avondale, Harare',
      status: 'active',
      dailyScans: 89,
      dailyVolume: 15890,
      lastScan: '14:28:00'
    },
    {
      id: 'QR002',
      merchant: 'OK Borrowdale',
      type: 'dynamic',
      location: 'Borrowdale, Harare',
      status: 'active',
      dailyScans: 156,
      dailyVolume: 32450,
      lastScan: '14:32:00'
    },
    {
      id: 'QR003',
      merchant: 'TM Sam Levy',
      type: 'static',
      location: 'Sam Levy Village, Harare',
      status: 'active',
      dailyScans: 234,
      dailyVolume: 45670,
      lastScan: '14:30:00'
    },
    {
      id: 'QR004',
      merchant: 'Zuva Chisipite',
      type: 'dynamic',
      location: 'Chisipite, Harare',
      status: 'active',
      dailyScans: 342,
      dailyVolume: 78900,
      lastScan: '14:31:00'
    },
    {
      id: 'QR005',
      merchant: 'Chicken Inn CBD',
      type: 'static',
      location: 'CBD, Harare',
      status: 'inactive',
      dailyScans: 0,
      dailyVolume: 0,
      lastScan: '18:45:00'
    },
    {
      id: 'QR006',
      merchant: "Nando's Eastgate",
      type: 'dynamic',
      location: 'Eastgate Mall, Harare',
      status: 'active',
      dailyScans: 78,
      dailyVolume: 12340,
      lastScan: '14:25:00'
    },
    {
      id: 'QR007',
      merchant: 'Food World Bulawayo',
      type: 'static',
      location: 'CBD, Bulawayo',
      status: 'active',
      dailyScans: 167,
      dailyVolume: 28900,
      lastScan: '14:20:00'
    }
  ];
  
  recentScans: RecentScan[] = [
    {
      merchant: 'OK Borrowdale',
      qrId: '****4821',
      amount: 245.00,
      timestamp: '14:32:15'
    },
    {
      merchant: 'Zuva Chisipite',
      qrId: '****7832',
      amount: 156.80,
      timestamp: '14:31:58'
    },
    {
      merchant: 'TM Sam Levy',
      qrId: '****1256',
      amount: 89.50,
      timestamp: '14:30:22'
    },
    {
      merchant: 'Spar Avondale',
      qrId: '****9045',
      amount: 312.00,
      timestamp: '14:28:45'
    },
    {
      merchant: "Nando's Eastgate",
      qrId: '****3367',
      amount: 67.50,
      timestamp: '14:25:10'
    }
  ];
  
  chartData: ChartDataPoint[] = [
    { day: 'Mon', staticQR: 12500, dynamicQR: 8900 },
    { day: 'Tue', staticQR: 15600, dynamicQR: 9200 },
    { day: 'Wed', staticQR: 18200, dynamicQR: 11500 },
    { day: 'Thu', staticQR: 14800, dynamicQR: 10200 },
    { day: 'Fri', staticQR: 21500, dynamicQR: 13400 },
    { day: 'Sat', staticQR: 24600, dynamicQR: 17800 },
    { day: 'Sun', staticQR: 19200, dynamicQR: 11800 }
  ];
  
  merchants = [
    'Spar Avondale',
    'OK Borrowdale',
    'TM Sam Levy',
    'Zuva Chisipite',
    'Chicken Inn CBD',
    "Nando's Eastgate",
    'Food World Bulawayo'
  ];
  
  qrTypes = ['static', 'dynamic'];
  
  get filteredQRCodes(): QRCode[] {
    let filtered = this.qrCodes;
    
    if (this.selectedFilter !== 'All') {
      if (this.selectedFilter === 'Static QR') {
        filtered = filtered.filter(qr => qr.type === 'static');
      } else if (this.selectedFilter === 'Dynamic QR') {
        filtered = filtered.filter(qr => qr.type === 'dynamic');
      } else if (this.selectedFilter === 'Inactive') {
        filtered = filtered.filter(qr => qr.status === 'inactive');
      }
    }
    
    if (this.searchQuery) {
      filtered = filtered.filter(qr =>
        qr.merchant.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        qr.id.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }
  
  setFilter(filter: string): void {
    this.selectedFilter = filter;
  }
  
  openGenerateModal(): void {
    this.showGenerateModal = true;
    this.resetForm();
  }
  
  closeGenerateModal(): void {
    this.showGenerateModal = false;
    this.resetForm();
  }
  
  openQRDetailsModal(qrCode: QRCode): void {
    this.selectedQRCode = qrCode;
    this.showQRDetailsModal = true;
  }
  
  closeQRDetailsModal(): void {
    this.showQRDetailsModal = false;
    this.selectedQRCode = null;
  }
  
  generateQRCode(): void {
    if (this.selectedMerchant && this.selectedQRType && this.qrLocation) {
      // Generate QR code logic here
      console.log('Generating QR Code:', {
        merchant: this.selectedMerchant,
        type: this.selectedQRType,
        location: this.qrLocation
      });
      this.closeGenerateModal();
    }
  }
  
  viewQRCode(qrCode: QRCode): void {
    this.openQRDetailsModal(qrCode);
  }
  
  downloadQR(qrCode: QRCode): void {
    console.log('Downloading QR:', qrCode.id);
  }
  
  regenerateQR(qrCode: QRCode): void {
    console.log('Regenerating QR:', qrCode.id);
  }
  
  deactivateQR(qrCode: QRCode): void {
    console.log('Deactivating QR:', qrCode.id);
    this.closeQRDetailsModal();
  }
  
  resetForm(): void {
    this.selectedMerchant = '';
    this.selectedQRType = '';
    this.qrLocation = '';
  }
  
  formatVolume(volume: number): string {
    return `$${volume.toLocaleString()}`;
  }
  
  getChartPath(data: number[], type: 'static' | 'dynamic'): string {
    const width = 1200;
    const height = 200;
    const padding = 40;
    
    const maxValue = Math.max(...this.chartData.map(d => Math.max(d.staticQR, d.dynamicQR)));
    const xStep = (width - 2 * padding) / (data.length - 1);
    
    let path = '';
    
    data.forEach((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((value / maxValue) * (height - 2 * padding));
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  }
  
  getStaticQRData(): number[] {
    return this.chartData.map(d => d.staticQR);
  }
  
  getDynamicQRData(): number[] {
    return this.chartData.map(d => d.dynamicQR);
  }
}