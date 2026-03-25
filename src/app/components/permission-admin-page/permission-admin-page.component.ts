import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-permission-admin-page',
  imports: [],
  templateUrl: './permission-admin-page.component.html',
  styleUrl: './permission-admin-page.component.scss',
})
export class PermissionAdminPageComponent {
  activeTab = signal('Results');
  tabs = ['ROLE', 'PERMISSION', 'CLASS'];
  // Actions
  setActiveTab(tab: string): void {
    this.activeTab.set(tab);
  }

}
