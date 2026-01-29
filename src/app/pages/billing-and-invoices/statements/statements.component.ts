import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PeriodSummary {
  label: string;
  value: string;
  icon: string;
  color: string;
  isNegative?: boolean;
}

interface Statement {
  statementId: string;
  period: string;
  dateRange: string;
  opening: number;
  credits: number;
  debits: number;
  closing: number;
}

@Component({
  selector: 'app-statements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.css']
})
export class StatementsComponent {
  currentPeriod = 'January 2024';

  // Period summary
  periodSummary: PeriodSummary[] = [
    { label: 'Opening Balance', value: '$5,200', icon: 'dollar', color: 'gray', isNegative: false },
    { label: 'Total Credits', value: '+$12,450.75', icon: 'trending-up', color: 'green', isNegative: false },
    { label: 'Total Debits', value: '-$8,900.5', icon: 'trending-down', color: 'red', isNegative: true },
    { label: 'Closing Balance', value: '$8,750.25', icon: 'dollar', color: 'purple', isNegative: false }
  ];

  // Filter states
  selectedYear = '2024';
  selectedQuarter = 'All Quarters';

  // Statements data
  statements: Statement[] = [
    {
      statementId: 'STM-2024-01',
      period: 'January 2024',
      dateRange: '2024-01-01 - 2024-01-31',
      opening: 5200,
      credits: 12450.75,
      debits: 8900.5,
      closing: 8750.25
    },
    {
      statementId: 'STM-2023-12',
      period: 'December 2023',
      dateRange: '2023-12-01 - 2023-12-31',
      opening: 3800,
      credits: 15600,
      debits: 14200,
      closing: 5200
    },
    {
      statementId: 'STM-2023-11',
      period: 'November 2023',
      dateRange: '2023-11-01 - 2023-11-30',
      opening: 2500,
      credits: 11800,
      debits: 10500,
      closing: 3800
    },
    {
      statementId: 'STM-2023-10',
      period: 'October 2023',
      dateRange: '2023-10-01 - 2023-10-31',
      opening: 4200,
      credits: 9500,
      debits: 11200,
      closing: 2500
    },
    {
      statementId: 'STM-2023-09',
      period: 'September 2023',
      dateRange: '2023-09-01 - 2023-09-30',
      opening: 3100,
      credits: 13400,
      debits: 12300,
      closing: 4200
    }
  ];

  filterByYear(year: string): void {
    this.selectedYear = year;
    console.log('Filter by year:', year);
  }

  filterByQuarter(quarter: string): void {
    this.selectedQuarter = quarter;
    console.log('Filter by quarter:', quarter);
  }

  downloadAll(): void {
    console.log('Downloading all statements');
  }

  viewStatement(statementId: string): void {
    console.log('Viewing statement:', statementId);
  }

  downloadStatement(statementId: string): void {
    console.log('Downloading statement:', statementId);
  }
}