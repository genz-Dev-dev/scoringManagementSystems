import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SignupAdminPageService } from 'src/app/api/signup-admin-page/signup-admin-page.service';
import { AuthServiceService } from 'src/app/api/auth/auth.service.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/Users';
import { user } from '@angular/fire/auth';
interface Role
{
  id: number;
  name: string;
}
@Component( {
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './sign-up-page.component.html',
  styleUrls: [ './sign-up-page.component.scss' ]
} )
export class SignUpPageComponent implements OnInit
{

  signupForm: FormGroup;
  passwordVisible = false;
  showForm = false;
  passwordStrength = 0;
  strengthLabel = 'No password';
  public roles: Role[] = [];
  userList: any[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  hasPrevious: boolean = false;
  hasNext: boolean = false;
  pages: number[] = [];
  strengthBars = [ 1, 2, 3, 4 ];
  currentUser: any;
  currentUserRole: string = '';
  countUser: Number = 0;
  countUserByVerityTrue: Number = 0;
  countUserByVerityFalse: number = 0;
  countUserUnactive: number = 0;
  constructor( private fb: FormBuilder, private signupAdminPageService: SignupAdminPageService, private authService: AuthServiceService, private router: Router )
  {
    this.signupForm = this.fb.group( {
      fullName: [ '', [ Validators.required, Validators.minLength( 3 ), Validators.maxLength( 20 ) ] ],
      email: [ '', [ Validators.required, Validators.email ] ],
      password: [ '', [ Validators.required, Validators.minLength( 6 ) ] ],
      role: [ '', [ Validators.required ] ],
      rememberMe: [ true ]
    } );

    this.signupForm.get( 'password' )?.valueChanges.subscribe( value =>
    {
      this.checkPasswordStrength( value );
    } );
  }

  ngOnInit (): void
  {
    this.getAllRoles();
    this.getAllUsers();
    const user = JSON.parse( localStorage.getItem( 'currentUser' ) || '{}' );

    this.currentUserRole = user.role;
    this.generatePages();
  }
  public getAllRoles ()
  {
    this.signupAdminPageService.getAllRole().subscribe( {
      next: ( res ) =>
      {
        this.roles = res.data;
      },
      error: ( err ) =>
      {
        console.error( "Error:", err );
      }
    } );
  }

  private handleUpdateStatusUser ( id: string, checked: boolean )
  {
    const status = !checked; // 🔥 reverse

    console.log( "checked:", checked );   // true/false
    console.log( "status:", status );     // reversed value

    this.signupAdminPageService.updateStatus( id, status ).subscribe( {
      next: ( res ) =>
      {
        console.log( "API response:", res );

        if ( res.success )
        {
          const user = this.userList.find( u => u.id === id );
          if ( user )
          {
            user.status = status;
          }
        }
      },
      error: ( err ) =>
      {
        console.log( "ERROR:", err );
      }
    } );
  }

  // getters
  get fullNameControl ()
  {
    return this.signupForm.get( 'fullName' );
  }

  get emailControl ()
  {
    return this.signupForm.get( 'email' );
  }

  get passwordControl ()
  {
    return this.signupForm.get( 'password' );
  }

  togglePassword ()
  {
    this.passwordVisible = !this.passwordVisible;
  }

  handleSignupAdminPage ()
  {
    if ( this.signupForm.invalid )
    {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.signupAdminPageService.signupAdminPage( this.signupForm.value ).subscribe( {
      next: ( res ) =>
      {
        if ( res && res.token )
        {
          localStorage.setItem( 'access_token', res.token );
          localStorage.setItem( 'user', JSON.stringify( res.data ) );
        }
        Swal.fire( {
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">បង្កើតគណនី</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
        this.closeForm();
        this.getAllUsers();
      },
      error: ( err ) =>
      {
        console.log( "ERROR:", err );
        Swal.fire( {
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">បង្កើតគណនី</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        } );
      }
    } );
  }
  public getAllUsers ()
  {
    this.signupAdminPageService.getAllUsers().subscribe( {
      next: ( res ) =>
      {
        this.userList = res.content;
        this.currentPage = res.number;
        this.pageSize = res.size;
        this.totalPages = res.totalPage;
        this.totalElements = res.totalElement;
        this.hasPrevious = res.hastPrevious;
        this.hasNext = res.hastNext;
        this.countUser = res.totalElement;
        this.countUserByVerityTrue = res.content.filter( ( user: any ) => user.verified === true ).length;
        this.countUserByVerityFalse = res.content.filter( ( user: any ) => user.verified === false ).length;
        this.countUserUnactive = res.content.filter( ( user: any ) => user.status === false ).length;
        this.generatePages();
        // console.log("count By veriry", this.countUserByVerityTrue);
        // console.log("count user unactive", this.countUserByVerityFalse)
        // console.log("Page info:", {
        //   currentPage: this.currentPage,
        //   pageSize: this.pageSize,
        //   totalPages: this.totalPages,
        //   totalElements: this.totalElements,
        //   hasPrevious: this.hasPrevious,
        //   hasNext: this.hasNext
        // });
      }, error: ( err ) =>
      {
        console.log( "err", err )
      }
    } )
  }
  generatePages ()
  {
    const pages = [];
    const start = Math.max( 1, this.currentPage - 2 );
    const end = Math.min( this.totalPages, this.currentPage + 2 );

    for ( let i = start; i <= end; i++ )
    {
      pages.push( i );
    }

    this.pages = pages;
  }
  // password strength
  checkPasswordStrength ( password: string )
  {

    let strength = 0;

    if ( !password )
    {
      this.passwordStrength = 0;
      this.strengthLabel = 'No password';
      return;
    }

    if ( password.length >= 6 ) strength++;
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
  toggleView ()
  {
    this.showForm = !this.showForm;
  }

  openForm ()
  {
    this.showForm = true;
  }

  closeForm ()
  {
    this.showForm = false;
  }

  RouterToDashboard ( router: string )
  {
    this.router.navigate( [ router ] );
  }
}
