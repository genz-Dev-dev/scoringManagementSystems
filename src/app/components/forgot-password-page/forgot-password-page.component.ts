import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/api/auth/auth.service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SigninAdminPageService } from 'src/app/api/signin-admin-page/signin-admin-page.service';
@Component( {
  selector: 'app-forgot-password-page',
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
} )
export class ForgotPasswordPageComponent
{
  step: number = 1;
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  forgotPasswordForm!: FormGroup;
  constructor( private authService: AuthServiceService, private signinService: SigninAdminPageService, private router: Router, private fb: FormBuilder )
  {
    this.forgotPasswordForm = this.fb.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
    } );
  }

  private handleSendOTP ()
  {
    if ( this.forgotPasswordForm.invalid )
    {
      alert( 'Please enter a valid email' );
      return;
    }
    const email = this.forgotPasswordForm.value.email;
    this.signinService.sendOtp( email ).subscribe( {
      next: ( response ) =>
      {
        this.step++
      },
      error: ( err ) =>
      {
        console.error( err );
        alert( err.error?.message || 'Failed to send OTP ' );
      }
    } );
  }

  verifyOTP ()
  {
    if ( !this.otp ) return alert( 'Enter OTP' );
    this.signinService.verifyOtp( this.forgotPasswordForm.value.email, this.otp ).subscribe( {
      next: () => this.step = 3,
      error: err => alert( 'Invalid OTP' )
    } );
  }

  changePassword ()
  {
    if ( !this.newPassword || this.newPassword !== this.confirmPassword )
    {
      return alert( 'Passwords do not match' );
    }
    this.signinService.changePassword( this.forgotPasswordForm.value.email, this.otp, this.newPassword ).subscribe( {
      next: () =>
      {
        alert( 'Password changed successfully' );
        this.step = 1;
        this.forgotPasswordForm.reset();
        this.otp = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: err => alert( err.error.message || 'Error changing password' )
    } );
  }

  goToSignin ( path: string )
  {
    this.router.navigate( [ path ] );
  }
}
