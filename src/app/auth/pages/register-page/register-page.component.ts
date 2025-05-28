import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '@auth/interfaces/user.interface';
import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from 'src/app/utils/form-utils';
import type { Address } from '@auth/interfaces/adress.interface';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { ErrorAlertComponent } from '@shared/components/error-alert/error-alert.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ErrorMessageComponent,
    ErrorAlertComponent,
    LoaderComponent,
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
  $newUser = signal<User | null>(null);

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

      address: ['', [Validators.maxLength(50)]],
      city: ['', [Validators.maxLength(50)]],
      state: ['', [Validators.maxLength(50)]],
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
    const addressFields = ['address', 'city', 'state', 'zip'];

    addressFields.forEach((field) => {
      this.registerForm.get(field)?.valueChanges.subscribe(() => {
        const hasAnyValue = addressFields.some(
          (key) => !!this.registerForm.get(key)?.value
        );

        addressFields.forEach((key) => {
          const control = this.registerForm.get(key);
          if (!control) return;

          const currentValidators = control.validator
            ? [control.validator]
            : [];

          const requiredValidator = Validators.required;

          if (hasAnyValue) {
            // Añade el required solo si no está
            const newValidators = [...currentValidators, requiredValidator];
            control.setValidators(newValidators);
          } else {
            // Quita sólo el required pero deja los demás
            const newValidators = currentValidators.filter(
              (v) => v !== requiredValidator
            );
            control.setValidators(newValidators);
          }

          control.updateValueAndValidity({ emitEvent: false });
        });
      });
    });
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
          this.$errorMessage.set(err.message || 'Error inesperado');
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

  createUser(): User {
    const { name = '', email = '', password = '' } = this.registerForm.value;

    const user: User = {
      name: name!,
      mail: email!,
      password: password!,
    };

    const address = this.buildAddress();
    if (address) {
      user.address = address;
    }

    return user;
  }

  private isFilled(value: string): boolean {
    return value?.trim() !== '';
  }

  private hasFullAddress(): boolean {
    const {
      address = '',
      city = '',
      state = '',
      zip = '',
    } = this.registerForm.value;

    return (
      this.isFilled(address!) &&
      this.isFilled(city!) &&
      this.isFilled(state!) &&
      this.isFilled(zip!)
    );
  }
  //TODO:verificar sin esto funciona
  private buildAddress(): Address | null {
    if (!this.hasFullAddress()) return null;

    const {
      address = '',
      city = '',
      state = '',
      zip = '',
    } = this.registerForm.value;

    return {
      street: address!,
      city: city!,
      country: state!,
      cp: zip!,
      location: '-',
    };
  }

  navigateToLogin() {
    this.router.navigateByUrl('/auth/login');
  }
}
