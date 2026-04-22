import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from 'src/app/api/auth/auth.service.service';
import { SigninAdminPageService } from 'src/app/api/signin-admin-page/signin-admin-page.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { User } from 'src/app/models/Users';
@Component( {
  selector: 'app-signin-page',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule ],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.scss'
} )
export class SigninPageComponent
{
  signinForm: FormGroup;
  passwordVisible = false;
  modalForm = false;
  passwordStrength = 0;
  strengthLabel = 'No password';
  strengthBars = [ 1, 2, 3, 4 ];
  constructor( private fb: FormBuilder, private signinAdminPage: SigninAdminPageService, private authService: AuthServiceService, private router: Router )
  {
    this.signinForm = this.fb.group( {
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength( 6 ) ] ]
    } );

    this.signinForm.get( 'password' )?.valueChanges.subscribe( value =>
    {
      this.checkPasswordStrength( value );
    } );
  }
  // getters
  get fullNameControl ()
  {
    return this.signinForm.get( 'fullName' );
  }
  get emailControl ()
  {
    return this.signinForm.get( 'email' );
  }
  get passwordControl ()
  {
    return this.signinForm.get( 'password' );
  }
  togglePassword ()
  {
    this.passwordVisible = !this.passwordVisible;
  }
  checkPasswordStrength ( password: string )
  {
    let strength = 0;

    if ( !password )
    {
      this.passwordStrength = 0;
      this.strengthLabel = 'No password';
      return;
    }
    if ( password.length >= 8 ) strength++;
    if ( password.match( /[A-Z]/ ) ) strength++;
    if ( password.match( /[0-9]/ ) ) strength++;
    if ( password.match( /[^A-Za-z0-9]/ ) ) strength++;
    this.passwordStrength = strength;
    const labels = [
      'Very Weak',
      'Weak',
      'Medium',
      'Strong',
      'Very Strong'
    ];
    this.strengthLabel = labels[ strength ];
  }
  getBarColor ( level: number )
  {
    if ( this.passwordStrength >= level )
    {
      if ( this.passwordStrength <= 1 ) return 'bg-error';
      if ( this.passwordStrength == 2 ) return 'bg-warning';
      if ( this.passwordStrength == 3 ) return 'bg-info';
      if ( this.passwordStrength >= 4 ) return 'bg-success';
    }
    return 'bg-base-300';
  }
  handleSigninAdminPage ()
  {
    if ( this.signinForm.invalid )
    {
      this.signinForm.markAllAsTouched();
      return;
    }
    this.signinAdminPage.signinAdminPage( this.signinForm.value ).subscribe( {
      next: ( res ) =>
      {
        if ( res )
        {
          const userData = res.data;
          // console.log("res", userData);
          const token = userData.token || userData.accessToken || userData.verificationToken;
          this.authService.setToken( token, {
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role || '',
            token: token
          } );
        }
        const fullname = res.data.fullName;
        Swal.fire( {
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">Signin</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } ).then( () =>
        {
          this.router.navigate( [ '' ] );
        } );
      },
      error: ( err ) =>
      {
        Swal.fire( {
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">SignUp</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
      }
    } )
  }
  goToSignin ( path: string )
  {
    this.router.navigate( [ path ] );
  }
}
