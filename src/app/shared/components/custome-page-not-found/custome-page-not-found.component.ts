import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-custome-page-not-found',
  imports: [],
  templateUrl: './custome-page-not-found.component.html',
  styleUrl: './custome-page-not-found.component.scss',
})
export class CustomePageNotFoundComponent {
  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(['/signin']);
  }
}
