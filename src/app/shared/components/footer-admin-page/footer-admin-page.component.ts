import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-footer-admin-page',
  imports: [CommonModule],
  templateUrl: './footer-admin-page.component.html',
  styleUrl: './footer-admin-page.component.scss',
})
export class FooterAdminPageComponent {
  currentYear: number = new Date().getFullYear();
}
