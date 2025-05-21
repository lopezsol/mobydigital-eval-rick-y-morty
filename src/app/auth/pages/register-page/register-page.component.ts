import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

  loginForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(15)],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.minLength(10),
        Validators.maxLength(50),
      ],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(30)],
    ],
    address: ['', [Validators.maxLength(50)]],
    city: ['', [Validators.maxLength(50)]],
    state: ['', [Validators.maxLength(50)]],
    zip: ['', [Validators.minLength(4), Validators.maxLength(4)]],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;
    console.log(email, password);

    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl('/characters');
        return;
      }

      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
    });
  }

  navigateToRegister() {
    this.router.navigateByUrl('/auth/register');
  }
}
