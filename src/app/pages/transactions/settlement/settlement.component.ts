import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Settlement {
  id: string;
  merchant: string;
  merchantCode: string;
  model: string;
  transactions: number;
  grossAmount: number;
  fees: number;
  netAmount: number;
  status: 'completed' | 'processing' | 'pending' | 'failed';
  date: string;
}

@Component({
  selector: 'app-settlement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settlement.component.html',
  styleUrl: './settlement.component.css'
})
export class SettlementComponent implements OnInit {
  // Summary metrics
  totalGross = 390830;
  totalFees = 3908.3;
  netPayable = 386921.7;
  pendingCount = 12;

  // Settlement types
  sameDayAmount = 128500;
  sameDayMerchants = 3;
  
  nextDayAmount = 262330;
  nextDayMerchants = 42;
  
  deferredAmount = 45890;
  deferredMerchants = 6;

  // Filter state
  activeFilter: 'All' | 'Pending' | 'Processing' | 'Completed' | 'Failed' = 'All';

  // Settlements data
  settlements: Settlement[] = [
    {
      id: 'SET248115001',
      merchant: 'Spar Supermarket',
      merchantCode: '****4521',
      model: 'T+1',
      transactions: 156,
      grossAmount: 45890,
      fees: 458.90,
      netAmount: 45431.1,
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: 'SET248115002',
      merchant: 'OK Zimbabwe',
      merchantCode: '****6532',
      model: 'T+1',
      transactions: 88,
      grossAmount: 32450,
      fees: 324.50,
      netAmount: 32125.5,
      status: 'processing',
      date: '2024-01-15'
    },
    {
      id: 'SET248115003',
      merchant: 'Zuva Petroleum',
      merchantCode: '****1256',
      model: 'T+0',
      transactions: 342,
      grossAmount: 128500,
      fees: 1285.00,
      netAmount: 127215,
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: 'SET248115004',
      merchant: 'TM Pick n Pay',
      merchantCode: '****3045',
      model: 'T+1',
      transactions: 234,
      grossAmount: 78650,
      fees: 786.50,
      netAmount: 77863.5,
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: 'SET248115005',
      merchant: 'Econet Shop',
      merchantCode: '****3367',
      model: 'T+1',
      transactions: 89,
      grossAmount: 15890,
      fees: 158.90,
      netAmount: 15731.1,
      status: 'failed',
      date: '2024-01-15'
    },
    {
      id: 'SET248114001',
      merchant: 'Innscor',
      merchantCode: '****5589',
      model: 'T+1',
      transactions: 456,
      grossAmount: 89450,
      fees: 894.50,
      netAmount: 88555.5,
      status: 'completed',
      date: '2024-01-14'
    }
  ];

  filteredSettlements: Settlement[] = [];

  ngOnInit() {
    this.filterSettlements();
  }

  setFilter(filter: 'All' | 'Pending' | 'Processing' | 'Completed' | 'Failed') {
    this.activeFilter = filter;
    this.filterSettlements();
  }

  filterSettlements() {
    if (this.activeFilter === 'All') {
      this.filteredSettlements = [...this.settlements];
    } else {
      this.filteredSettlements = this.settlements.filter(
        s => s.status === this.activeFilter.toLowerCase()
      );
    }
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  refreshData() {
    console.log('Refreshing settlement data...');
  }

  exportData() {
    console.log('Exporting settlement data...');
  }
}