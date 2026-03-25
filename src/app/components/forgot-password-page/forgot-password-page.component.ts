import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/api/auth/auth.service.service';

import { Router } from '@angular/router';
import { SigninAdminPageService } from 'src/app/api/signin-admin-page/signin-admin-page.service';
@Component({
  selector: 'app-forgot-password-page',
  imports: [],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
})
export class ForgotPasswordPageComponent {
  step: number = 1;
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthServiceService, private signinService: SigninAdminPageService, private router: Router) { }

  sendOTP() {
    if (!this.email) return alert('Enter your email');
    this.signinService.sendOtp(this.email).subscribe({
      next: () => this.step = 2,
      error: err => alert(err.error.message || 'Email not found')
    });
  }

  verifyOTP() {
    if (!this.otp) return alert('Enter OTP');
    this.signinService.verifyOtp(this.email, this.otp).subscribe({
      next: () => this.step = 3,
      error: err => alert('Invalid OTP')
    });
  }

  changePassword() {
    if (!this.newPassword || this.newPassword !== this.confirmPassword) {
      return alert('Passwords do not match');
    }
    this.signinService.changePassword(this.email, this.otp, this.newPassword).subscribe({
      next: () => {
        alert('Password changed successfully');
        this.step = 1;
        this.email = '';
        this.otp = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: err => alert(err.error.message || 'Error changing password')
    });
  }

  goToSignin(path: string) {
    this.router.navigate([path]);
  }
}
