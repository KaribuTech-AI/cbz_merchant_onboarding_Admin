import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lifecycle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lifecycle.component.html',
  styleUrls: ['./lifecycle.component.css']
})
export class LifecycleComponent implements OnInit {
  // Stats
  stats = {
    new: 45,
    active: 256,
    growth: 42,
    atRisk: 18,
    dormant: 12,
    churned: 4
  };

  // Chart data
  months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  
  chartData = [
    { month: 'Aug', active: 195, new: 12, churned: 4 },
    { month: 'Sep', active: 210, new: 18, churned: 3 },
    { month: 'Oct', active: 225, new: 20, churned: 5 },
    { month: 'Nov', active: 248, new: 28, churned: 5 },
    { month: 'Dec', active: 250, new: 15, churned: 13 },
    { month: 'Jan', active: 248, new: 12, churned: 4 }
  ];

  gridLinesY = [50, 100, 150, 200, 250];
  yAxisLabels = ['250', '195', '130', '65', '0'];
  
  activeLinePath = '';
  newLinePath = '';
  churnedLinePath = '';

  // Tooltip
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipData: any = null;

  // Lifecycle Distribution
  lifecycleDistribution = [
    { name: 'New', count: 45, color: '#3b82f6' },
    { name: 'Active', count: 256, color: '#38a169' },
    { name: 'Growth', count: 42, color: '#ed8936' },
    { name: 'At Risk', count: 18, color: '#ecc94b' }
  ];

  // Recent Events
  recentEvents = [
    {
      merchant: 'OK Zimbabwe',
      description: 'Upgraded to Growth',
      date: '2024-01-15',
      type: 'success'
    },
    {
      merchant: 'Econet Shop',
      description: 'Flagged as At Risk',
      date: '2024-01-14',
      type: 'warning'
    },
    {
      merchant: 'Fashion Forward',
      description: 'Completed Onboarding',
      date: '2024-01-13',
      type: 'success'
    },
    {
      merchant: 'Auto Parts Direct',
      description: 'Moved to Dormant',
      date: '2024-01-08',
      type: 'error'
    },
    {
      merchant: 'Spar Supermarket',
      description: 'Contract Renewed',
      date: '2024-01-05',
      type: 'success'
    }
  ];

  // Key Metrics
  keyMetrics = [
    { label: 'Avg Health Score', value: '78.5', icon: 'trend' },
    { label: 'Engagement Rate', value: '72%', icon: 'activity' },
    { label: 'Churn Rate (MTD)', value: '1.2%', icon: 'percent' },
    { label: 'Retention Rate', value: '98.8%', icon: 'users' },
    { label: 'Renewals Due (30d)', value: '12', icon: 'calendar' }
  ];

  // At-Risk Alerts
  atRiskAlerts = [
    {
      merchant: 'Econet Shop',
      message: 'Volume dropped 22% this month. 5 open support tickets.',
      severity: 'warning'
    },
    {
      merchant: 'Book Haven',
      message: 'Volume dropped 34% this month. Engagement score declining.',
      severity: 'warning'
    },
    {
      merchant: 'Auto Parts Direct',
      message: 'No transactions in 28 days. Contract renewal in 30 days.',
      severity: 'error'
    }
  ];

  // Merchants Data
  merchants = [
    {
      name: 'Spar Supermarket',
      id: 'MER001',
      stage: 'Active',
      healthScore: 92,
      monthlyVolume: '$245,000',
      trend: 15,
      engagement: 95,
      riskLevel: 'Low',
      renewal: '2024-06-15'
    },
    {
      name: 'TM Pick n Pay',
      id: 'MER003',
      stage: 'Active',
      healthScore: 88,
      monthlyVolume: '$78,500',
      trend: 8,
      engagement: 78,
      riskLevel: 'Low',
      renewal: '2024-05-10'
    },
    {
      name: 'Zuva Petroleum',
      id: 'MER007',
      stage: 'Active',
      healthScore: 94,
      monthlyVolume: '$245,000',
      trend: 12,
      engagement: 88,
      riskLevel: 'Low',
      renewal: '2024-08-20'
    },
    {
      name: 'Auto Parts Direct',
      id: 'MER008',
      stage: 'Dormant',
      healthScore: 25,
      monthlyVolume: '$0',
      trend: -100,
      engagement: 18,
      riskLevel: 'High',
      renewal: '2024-02-15'
    }
  ];

  filteredMerchants = [...this.merchants];
  searchTerm = '';
  selectedStage = 'all';

  ngOnInit(): void {
    this.generateChartPaths();
  }

  generateChartPaths(): void {
    const width = 700;
    const height = 250;
    const padding = { left: 50, right: 50, top: 50, bottom: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const xStep = chartWidth / (this.chartData.length - 1);
    const yMax = 250;

    // Active line
    const activePoints = this.chartData.map((d, i) => {
      const x = padding.left + (i * xStep);
      const y = padding.top + chartHeight - (d.active / yMax * chartHeight);
      return `${x},${y}`;
    });
    this.activeLinePath = `M ${activePoints.join(' L ')}`;

    // New line
    const newPoints = this.chartData.map((d, i) => {
      const x = padding.left + (i * xStep);
      const y = padding.top + chartHeight - (d.new / yMax * chartHeight);
      return `${x},${y}`;
    });
    this.newLinePath = `M ${newPoints.join(' L ')}`;

    // Churned line
    const churnedPoints = this.chartData.map((d, i) => {
      const x = padding.left + (i * xStep);
      const y = padding.top + chartHeight - (d.churned / yMax * chartHeight);
      return `${x},${y}`;
    });
    this.churnedLinePath = `M ${churnedPoints.join(' L ')}`;
  }

  getCircumference(): number {
    return 2 * Math.PI * 70;
  }

  onChartMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;
    const index = Math.floor((x / width) * this.chartData.length);
    
    if (index >= 0 && index < this.chartData.length) {
      this.tooltipVisible = true;
      this.tooltipData = this.chartData[index];
      this.tooltipX = event.clientX - rect.left + 10;
      this.tooltipY = event.clientY - rect.top - 80;
    }
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
  }

  filterMerchants(): void {
    this.filteredMerchants = this.merchants.filter(merchant => {
      const matchesSearch = !this.searchTerm || 
        merchant.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        merchant.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStage = this.selectedStage === 'all' || 
        merchant.stage.toLowerCase() === this.selectedStage;
      
      return matchesSearch && matchesStage;
    });
  }

  filterByStage(stage: string): void {
    this.selectedStage = stage;
    this.filterMerchants();
  }

  getHealthColor(score: number): string {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  getEngagementColor(engagement: number): string {
    if (engagement >= 70) return 'high';
    if (engagement >= 40) return 'medium';
    return 'low';
  }
}