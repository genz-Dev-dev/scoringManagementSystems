import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SignupAdminPageService } from 'src/app/api/signup-admin-page/signup-admin-page.service';
import { AuthServiceService } from 'src/app/api/auth/auth.service.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/Users';
@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss']
})
export class SignUpPageComponent {

  signupForm: FormGroup;
  passwordVisible = false;
  showForm = false;
  passwordStrength = 0;
  strengthLabel = 'No password';

  strengthBars = [1, 2, 3, 4];

  constructor(private fb: FormBuilder, private signupAdminPageService: SignupAdminPageService, private authService: AuthServiceService, private router: Router) {

    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true]
    });

    this.signupForm.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordStrength(value);
    });
  }

  // getters
  get fullNameControl() {
    return this.signupForm.get('fullName');
  }

  get emailControl() {
    return this.signupForm.get('email');
  }

  get passwordControl() {
    return this.signupForm.get('password');
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  handleSignupAdminPage() {

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.signupAdminPageService.signupAdminPage(this.signupForm.value).subscribe({
      next: (res) => {
        // console.log(res)
        // Adjust fields according to your API response
        if (res) {
          const userData = res.data;

          this.authService.setToken(userData.verificationToken, {
            fullName: userData.fullName,
            email: userData.email,
            role: userData.role || '',
            token: userData.verificationToken
          });

          const fullname = res.data.fullName;
          Swal.fire({
            icon: 'success',
            timer: 2500,
            iconColor: '#10b981',
            html: `<p style="font-size:16px;">បាន<span style="font-weight: bold;color: #10b981;">SignUp</span>បានទេ!</p>`,
            showCancelButton: false,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['']);
          });
        }
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

  // password strength
  checkPasswordStrength(password: string) {

    let strength = 0;

    if (!password) {
      this.passwordStrength = 0;
      this.strengthLabel = 'No password';
      return;
    }

    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;

    this.passwordStrength = strength;

    const labels = [
      'Very Weak',
      'Weak',
      'Medium',
      'Strong',
      'Very Strong'
    ];

    this.strengthLabel = labels[strength];
  }

  getBarColor(level: number) {

    if (this.passwordStrength >= level) {

      if (this.passwordStrength <= 1) return 'bg-error';
      if (this.passwordStrength == 2) return 'bg-warning';
      if (this.passwordStrength == 3) return 'bg-info';
      if (this.passwordStrength >= 4) return 'bg-success';

    }

    return 'bg-base-300';
  }
  toggleView() {
    this.showForm = !this.showForm;
  }
  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }
}
