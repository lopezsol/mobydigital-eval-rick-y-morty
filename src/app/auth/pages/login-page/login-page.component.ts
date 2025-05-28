import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserLogin } from '@auth/interfaces/user-login.interface';
import { of, tap } from 'rxjs';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ErrorAlertComponent } from '@shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ErrorAlertComponent,
    LoaderComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  $hasError = signal(false);
  $user = signal<UserLogin | null>(null);

  $authResource = rxResource({
    request: () => {
      return { user: this.$user() };
    },
    loader: ({ request }) => {
      if (!request.user) return of(null);
      return this.authService
        .login(request.user.mail, request.user.password)
        .pipe(
          tap((isAuthenticated) => {
            if (isAuthenticated) {
              this.navigateToCharacters();
            } else {
              throw new Error('Invalid credentials');
            }
          })
        );
    },
  });

  loginForm = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(FormUtils.emailPattern),
        Validators.minLength(10),
        Validators.maxLength(50),
      ],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(30)],
    ],
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.$hasError.set(true);
      return;
    }

    const { email = '', password = '' } = this.loginForm.value;
    this.$user.set({ mail: email!, password: password! });
  }

  navigateToCharacters() {
    this.router.navigateByUrl('/characters');
  }
}
