import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { ErrorAlertComponent } from '../../../shared/components/error-alert/error-alert.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { User } from '@auth/interfaces/user.interface';
import { UserLogin } from '@auth/interfaces/user-login.interface';
import { catchError, of, tap } from 'rxjs';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

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
  $hasError = signal(false);
  $user = signal<UserLogin | null>(null);
  $formSubmitted = signal(false);

  authService = inject(AuthService);

  $userLogin = computed<UserLogin | null>(() => {
    if (!this.$formSubmitted()) return null;
    console.log('entre al login');
    const { email, password } = this.loginForm.value;
    return { mail: email ?? '', password: password ?? '' };
  });

  $authResource = rxResource({
    request: () => {
      // Solo retorna el usuario si el formulario ha sido enviado
      return { user: this.$userLogin() };
    },
    loader: ({ request }) => {
      // Si no hay usuario o el formulario no se ha enviado, retorna un observable vacío
      if (!request.user) return of(null);

      return this.authService
        .login(request.user.mail, request.user.password)
        .pipe(
          tap((isAuthenticated) => {
            if (isAuthenticated) {
              this.router.navigateByUrl('/characters');
            }
          }),
          catchError((error) => {
            // Manejar el error pero devolver un valor para que no se quede en estado de error
            this.$hasError.set(true);
            setTimeout(() => {
              this.$hasError.set(false);
            }, 2000);
            return of(false); // Devuelve un valor para que no se quede en estado de error
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
      setTimeout(() => {
        this.$hasError.set(false);
      }, 2000);
      return;
    }

    // const { email = '', password = '' } = this.loginForm.value;
    // this.$user.set({ mail: email!, password: password! });
    this.$formSubmitted.set(true);

    // this.authService.login(email!, password!).subscribe((isAuthenticated) => {
    //   if (isAuthenticated) {
    //     this.router.navigateByUrl('/characters');
    //     return;
    //   }

    //   this.$hasError.set(true);
    //   setTimeout(() => {
    //     this.$hasError.set(false);
    //   }, 2000);
    // });
  }
}
