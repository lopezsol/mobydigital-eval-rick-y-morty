import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormUtils } from 'src/app/utils/form-utils';
import { catchError, of, tap } from 'rxjs';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ErrorMessageFormComponent } from '@shared/components/error-message-form/error-message-form.component';
import { AuthService } from '@auth/services/auth.service';
import type { Address } from '@auth/interfaces/adress.interface';
import type { RegisterUserDto } from '@auth/interfaces/register-user-dto.interface';
import { SnackbarErrorComponent } from '@shared/components/snackbar-error/snackbar-error.component';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LoaderComponent,
    ErrorMessageFormComponent,
    SnackbarErrorComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  formUtils = FormUtils;
  $hasError = signal(false);
  $errorMessage = signal('');
  $newUser = signal<RegisterUserDto | null>(null);

  countries: string[] = [
    'Argentina',
    'Brasil',
    'Chile',
    'Uruguay',
    'Paraguay',
    'Bolivia',
    'Perú',
    'Colombia',
    'Ecuador',
    'México',
    'España',
    'Estados Unidos',
    'Canadá',
    'Alemania',
    'Francia',
    'Italia',
    'Reino Unido',
    'Japón',
    'China',
    'Australia',
  ];

  registerForm = this.fb.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(15),
          Validators.pattern(FormUtils.namePattern),
        ],
      ],
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
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
        ],
      ],
      password2: ['', Validators.required],

      street: ['', [Validators.maxLength(50)]],
      city: ['', [Validators.maxLength(50)]],
      country: ['', [Validators.maxLength(50)]],
      zip: ['', [Validators.minLength(4), Validators.maxLength(4)]],
    },
    {
      validators: [FormUtils.isFieldOneEqualFieldTwo('password', 'password2')],
    }
  );

  ngOnInit() {
    this.setupAddressValidation();
  }

  private setupAddressValidation(): void {
    const addressFields = ['street', 'city', 'location', 'country', 'zip'];

    addressFields.forEach((field) => {
      const control = this.registerForm.get(field);
      if (!control) return;

      control.valueChanges.subscribe(() => {
        const hasAnyValue = addressFields.some(
          (key) => !!this.registerForm.get(key)?.value
        );

        addressFields.forEach((key) => {
          const ctrl = this.registerForm.get(key);
          if (!ctrl) return;

          ctrl.setValidators(
            hasAnyValue
              ? [...this.getBaseValidators(key), Validators.required]
              : this.getBaseValidators(key)
          );
          ctrl.updateValueAndValidity({ emitEvent: false });
        });
      });
    });
  }

  private getBaseValidators(field: string) {
    switch (field) {
      case 'country':
      case 'city':
      case 'location':
      case 'street':
        return [Validators.maxLength(50)];
      case 'zip':
        return [Validators.minLength(4), Validators.maxLength(4)];
      default:
        return [];
    }
  }

  $authResource = rxResource({
    request: () => {
      return { newUser: this.$newUser() };
    },
    loader: ({ request }) => {
      if (!request.newUser) return of(null);

      return this.authService.register(request.newUser).pipe(
        tap((response) => {
          if (response.header.resultCode === 0) {
            this.navigateToLogin();
          }
        }),
        catchError((err: Error) => {
          this.$hasError.set(true);
          this.$errorMessage.set(err.message);
          return of(false);
        })
      );
    },
  });

  onSubmit() {
    this.registerForm.markAllAsTouched();
    if (!this.registerForm.valid) return;

    const newUser = this.createUser();
    this.$newUser.set(newUser);
  }

  createUser(): RegisterUserDto {
    const formValue = this.registerForm.getRawValue();

    const { name = '', email = '', password = '' } = this.registerForm.value;

    const user: RegisterUserDto = {
      name: name!,
      mail: email!,
      password: password!,
    };

    const address: Address = this.registerForm.value.street?.trim()
      ? {
          street: formValue.street?.trim()!,
          location: '',
          city: formValue.city?.trim()!,
          country: formValue.country?.trim()!,
          cp: formValue.zip?.toString()!,
        }
      : ({} as Address);

    if (address) {
      user.address = address;
    }

    return user;
  }

  navigateToLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
