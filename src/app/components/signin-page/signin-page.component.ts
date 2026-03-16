import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthServiceService } from 'src/app/api/auth/auth.service.service';
import { SigninAdminPageService } from 'src/app/api/signin-admin-page/signin-admin-page.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signin-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signin-page.component.html',
  styleUrl: './signin-page.component.scss'
})
export class SigninPageComponent {
  signinForm: FormGroup;
  constructor(private fb: FormBuilder, private signinAdminPage: SigninAdminPageService, private authService: AuthServiceService, private router: Router) {
    this.signinForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  handleSigninAdminPage() {
    // console.log("value", this.signinForm.value);
    if (this.signinForm.valid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    this.signinAdminPage.signinAdminPage(this.signinForm.value).subscribe({
      next: (res) => {
        if (res) {
          const userData = res.data;
          this.authService.setToken(userData.verificationToken, {
            fullName: userData.fullName,
            email: userData.email,
            role: userData.roles?.[0] || '',
            token: userData.verificationToken
          });
        }

        const fullname = res.data.fullName;
        Swal.fire({
          icon: 'success',
          timer: 2500,
          iconColor: '#10b981',
          html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">Signin</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['']);
        });
      },
      error: (err) => {
        Swal.fire({
          icon: 'warning',
          timer: 2500,
          iconColor: '#b91c1c',
          html: `<p style="font-size:16px;">មិនអាច<span style="font-weight: bold;color: #b91c1c;">SignUp</span>បានទេ!</p>`,
          showCancelButton: false,
          showConfirmButton: false,
        });
      }
    })

  }
}
