import { Component } from '@angular/core';
import { TokenServiceService } from 'src/app/core/services/token/token.service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';
import { ResetPasswordService } from 'src/app/core/services/signin/reset-password.service';
@Component( {
  selector: 'app-forgot-password-page',
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
} )
export class ForgotPasswordPageComponent implements OnInit
{
  step: number = 1;
  otp: string = '';
  changePasswordForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  otpForm!: FormGroup;
  currentUserToekn: string;
  constructor(private authService: TokenServiceService, private signinService: ResetPasswordService, private router: Router, private fb: FormBuilder )
  {
    this.forgotPasswordForm = this.fb.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
    } );
    this.otpForm = this.fb.group( {
      otp1: [ '', [ Validators.required ] ],
      otp2: [ '', [ Validators.required ] ],
      otp3: [ '', [ Validators.required ] ],
      otp4: [ '', [ Validators.required ] ],
      otp5: [ '', [ Validators.required ] ],
      otp6: [ '', [ Validators.required ] ],
    } );
    this.changePasswordForm = this.fb.group( {
      newPassword: [ '', [ Validators.required ] ],
      confirmPassword: [ '', [ Validators.required ] ],
    } );
  }
  ngOnInit (): void
  {
    const user = JSON.parse( localStorage.getItem( 'currentUser' ) || '{}' );
    this.currentUserToekn = user.token;
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
      }
    } );
  }
  private handleVerifyOTP ()
  {
    if ( this.otpForm.invalid ) return alert( 'Enter OTP' );
    this.otp = this.otpForm.value.otp1 + this.otpForm.value.otp2 + this.otpForm.value.otp3 + this.otpForm.value.otp4 + this.otpForm.value.otp5 + this.otpForm.value.otp6;
    this.signinService.verifyOtp( this.forgotPasswordForm.value.email, this.otp ).subscribe( {
      next: () => this.step = 3,
      error: err => alert( err.error.message || 'Invalid OTP' )
    } );
  }
  private changePassword ()
  {
    if ( this.changePasswordForm.invalid )
    {
      return alert( 'Please enter a valid password' );
    }
    const { newPassword, confirmPassword } = this.changePasswordForm.value;

    if ( newPassword !== confirmPassword )
    {
      return alert( 'Passwords do not match' );
    }
    this.signinService.changePassword( this.currentUserToekn, newPassword )
      .subscribe( {
        next: () =>
        {
          alert( 'Password changed successfully' );
          this.step = 1;
          this.forgotPasswordForm.reset();
          this.changePasswordForm.reset();
          this.router.navigate( [ '' ] );
        },
        error: err => alert( err.error.message || 'Error changing password' )
      } );
  }
  goToSignin ( path: string )
  {
    this.router.navigate( [ path ] );
  }
}
