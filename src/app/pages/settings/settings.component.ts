import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TeamMember {
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending';
  lastLogin: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface NewTeamMember {
  fullName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  // Active tab
  activeTab: 'business-profile' | 'user-management' | 'notifications' | 'security' | 'api-keys' = 'business-profile';

  // Business Profile
  businessName = 'Spar Avondale (Pvt) Ltd';
  merchantId = 'MID-2024-SA001';
  businessType = 'Retail - Supermarket';
  mccCode = '5411 - Grocery Stores';
  registrationDate = 'January 1, 2024';
  accountStatus = 'active';

  // Contact Information
  contactPerson = 'Sphesihle Magagula';
  emailAddress = 'admin@sparavondale.com';
  phoneNumber = '+263 24 2123456';
  mobileNumber = '+263 77 1234567';
  businessAddress = '123 King George Road, Avondale, Harare';

  // Team Members
  teamMembers: TeamMember[] = [
    {
      name: 'John Manager',
      email: 'john@sparavondale.com',
      role: 'Admin',
      status: 'active',
      lastLogin: 'Today, 2:30 PM'
    },
    {
      name: 'Sarah Cashier',
      email: 'sarah@sparavondale.com',
      role: 'Cashier',
      status: 'active',
      lastLogin: 'Today, 9:15 AM'
    },
    {
      name: 'Mike Accountant',
      email: 'mike@sparavondale.com',
      role: 'Finance',
      status: 'active',
      lastLogin: 'Yesterday, 4:45 PM'
    },
    {
      name: 'Lisa Support',
      email: 'lisa@sparavondale.com',
      role: 'Viewer',
      status: 'pending',
      lastLogin: 'Never'
    }
  ];

  showAddUserModal = false;
  newTeamMember: NewTeamMember = {
    fullName: '',
    email: '',
    role: ''
  };

  // Notification Settings
  notificationSettings: NotificationSetting[] = [
    {
      id: 'large-transactions',
      title: 'Large Transaction Alerts',
      description: 'Get notified for transactions above $1,000',
      enabled: true
    },
    {
      id: 'failed-transactions',
      title: 'Failed Transaction Alerts',
      description: 'Get notified when transactions fail',
      enabled: true
    },
    {
      id: 'refund-notifications',
      title: 'Refund Notifications',
      description: 'Get notified when refunds are processed',
      enabled: true
    },
    {
      id: 'daily-settlement',
      title: 'Daily Settlement Summary',
      description: 'Receive daily settlement reports via email',
      enabled: true
    },
    {
      id: 'settlement-completed',
      title: 'Settlement Completed',
      description: 'Get notified when funds are settled',
      enabled: true
    },
    {
      id: 'new-dispute',
      title: 'New Dispute Received',
      description: 'Immediate notification for new chargebacks',
      enabled: true
    },
    {
      id: 'dispute-deadline',
      title: 'Dispute Deadline Reminders',
      description: 'Reminders before response deadlines',
      enabled: true
    }
  ];

  // Security Settings
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  enable2FA = false;

  // API Keys
  merchantIdAPI = 'MID-2024-SA001';
  apiKeyProduction = 'pk_live_**************************abcd';
  apiKeySandbox = 'pk_test_**************************efgh';

  setActiveTab(tab: 'business-profile' | 'user-management' | 'notifications' | 'security' | 'api-keys'): void {
    this.activeTab = tab;
  }

  saveChanges(): void {
    console.log('Saving business profile changes');
  }

  openAddUserModal(): void {
    this.showAddUserModal = true;
    this.resetNewTeamMember();
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
  }

  sendInvitation(): void {
    console.log('Sending invitation:', this.newTeamMember);
    this.showAddUserModal = false;
  }

  resetNewTeamMember(): void {
    this.newTeamMember = {
      fullName: '',
      email: '',
      role: ''
    };
  }

  editMember(member: TeamMember): void {
    console.log('Editing member:', member);
  }

  deleteMember(member: TeamMember): void {
    console.log('Deleting member:', member);
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  saveNotificationPreferences(): void {
    console.log('Saving notification preferences');
  }

  updatePassword(): void {
    console.log('Updating password');
  }

  toggle2FA(): void {
    console.log('Toggling 2FA:', this.enable2FA);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard:', text);
  }

  regenerateKey(keyType: string): void {
    console.log('Regenerating key:', keyType);
  }
}