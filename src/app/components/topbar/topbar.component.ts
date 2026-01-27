import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  @Input() title: string = 'Dashboard';
  @Input() subtitle: string = 'Overview of merchant acquiring operations';
  @Input() isSidebarCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  notificationCount: number = 3;

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}