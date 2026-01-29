import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Terminal {
  id: string;
  model: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  lastTransaction: string;
  todayVolume: number;
  todayTxns: number;
  signal: 'excellent' | 'good' | 'poor' | 'none';
}

@Component({
  selector: 'app-pos-terminals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos-terminals.component.html',
  styleUrls: ['./pos-terminals.component.css']
})
export class PosTerminalsComponent {
  // Stats
  totalTerminals = 5;
  onlineTerminals = 3;
  offlineTerminals = 1;
  todayVolume = 18690;
  
  // Modal
  showRequestModal = false;
  
  // Form data
  selectedTerminalType = '';
  installationLocation = '';
  requestReason = '';
  selectedUrgency = '';
  
  searchQuery = '';
  
  terminals: Terminal[] = [
    {
      id: 'TID-001',
      model: 'Ingenico Move 5000',
      location: 'Main Checkout',
      status: 'online',
      lastTransaction: '2 min ago',
      todayVolume: 8450,
      todayTxns: 87,
      signal: 'good'
    },
    {
      id: 'TID-002',
      model: 'Ingenico Move 5000',
      location: 'Express Lane',
      status: 'online',
      lastTransaction: '5 min ago',
      todayVolume: 5230,
      todayTxns: 42,
      signal: 'excellent'
    },
    {
      id: 'TID-003',
      model: 'Verifone VX520',
      location: 'Customer Service',
      status: 'online',
      lastTransaction: '15 min ago',
      todayVolume: 3120,
      todayTxns: 23,
      signal: 'good'
    },
    {
      id: 'TID-004',
      model: 'PAX A920',
      location: 'Food Court Kiosk',
      status: 'offline',
      lastTransaction: '2 hours ago',
      todayVolume: 1890,
      todayTxns: 15,
      signal: 'poor'
    },
    {
      id: 'TID-005',
      model: 'Ingenico Desk 5000',
      location: 'Pharmacy Counter',
      status: 'maintenance',
      lastTransaction: '1 day ago',
      todayVolume: 0,
      todayTxns: 0,
      signal: 'none'
    }
  ];
  
  terminalTypes = [
    'Ingenico Move 5000',
    'Ingenico Desk 5000',
    'Verifone VX520',
    'PAX A920',
    'Other'
  ];
  
  urgencyLevels = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ];
  
  get filteredTerminals(): Terminal[] {
    if (!this.searchQuery) {
      return this.terminals;
    }
    
    return this.terminals.filter(terminal =>
      terminal.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      terminal.model.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      terminal.location.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  
  openRequestModal(): void {
    this.showRequestModal = true;
    this.resetForm();
  }
  
  closeRequestModal(): void {
    this.showRequestModal = false;
    this.resetForm();
  }
  
  submitRequest(): void {
    if (this.selectedTerminalType && this.installationLocation && this.requestReason && this.selectedUrgency) {
      console.log('Submitting request:', {
        terminalType: this.selectedTerminalType,
        location: this.installationLocation,
        reason: this.requestReason,
        urgency: this.selectedUrgency
      });
      this.closeRequestModal();
    }
  }
  
  resetForm(): void {
    this.selectedTerminalType = '';
    this.installationLocation = '';
    this.requestReason = '';
    this.selectedUrgency = '';
  }
  
  formatVolume(volume: number): string {
    return `$${volume.toLocaleString()}`;
  }
  
  getStatusClass(status: string): string {
    return `status-${status}`;
  }
  
  getSignalClass(signal: string): string {
    return `signal-${signal}`;
  }
  
  getSignalIcon(signal: string): string {
    const icons = {
      'excellent': '📶',
      'good': '📶',
      'poor': '📶',
      'none': '📵'
    };
    return icons[signal as keyof typeof icons] || '';
  }
}