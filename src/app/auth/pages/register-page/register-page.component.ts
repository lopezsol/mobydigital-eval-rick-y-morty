import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '@auth/interfaces/user.interface';
import { AuthService } from '@auth/services/auth.service';
import { FormUtils } from 'src/app/utils/form-utils';
import { Address } from '@auth/interfaces/adress.interface';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { ErrorAlertComponent } from '@shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-register-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ErrorMessageComponent,
    ErrorAlertComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  fb = inject(FormBuilder);
  $hasError = signal(false);
  $errorMessage = signal('');
  router = inject(Router);

  authService = inject(AuthService);
  formUtils = FormUtils;

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

  loginForm = this.fb.group(
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
    //TODO:separar
    const addressFields = ['address', 'city', 'state', 'zip'];

    addressFields.forEach((field) => {
      this.loginForm.get(field)?.valueChanges.subscribe(() => {
        const hasAnyValue = addressFields.some(
          (key) => !!this.loginForm.get(key)?.value
        );

        addressFields.forEach((key) => {
          const control = this.loginForm.get(key);
          if (hasAnyValue) {
            control?.setValidators(Validators.required);
          } else {
            control?.clearValidators();
          }
          control?.updateValueAndValidity({ emitEvent: false });
        });
      });
    });
  }

  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (!this.loginForm.valid) return;

    const newUser = this.createUser();

    this.authService.register(newUser).subscribe({
      next: () => {
        this.router.navigateByUrl('/auth/login');
      },
      error: (err: Error) => {
        this.$errorMessage.set(err.message);
        this.$hasError.set(true);
        setTimeout(() => {
          this.$hasError.set(false);
          this.$errorMessage.set('');
        }, 3000);
      },
    });
  }

  createUser(): User {
    const { name = '', email = '', password = '' } = this.loginForm.value;

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
    } = this.loginForm.value;

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
    } = this.loginForm.value;

    return {
      street: address!,
      city: city!,
      country: state!,
      cp: zip!,
      location: '-',
    };
  }
}
