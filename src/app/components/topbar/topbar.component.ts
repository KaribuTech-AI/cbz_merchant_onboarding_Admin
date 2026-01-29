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
  @Input() title = '';
  @Input() subtitle = '';
  @Input() isSidebarCollapsed = false;

  @Output() toggleSidebar = new EventEmitter<void>();

  notificationCount = 3;

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
