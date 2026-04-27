import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-custome-page-not-found',
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {
  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(['/signin']);
  }
}
