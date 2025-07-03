import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of, tap } from 'rxjs';
import { UserService } from '@user/services/user.service';
import { AuthService } from '@auth/services/auth.service';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { SnackbarErrorComponent } from '@shared/components/snackbar-error/snackbar-error.component';
import { ErrorMessageFormComponent } from '@shared/components/error-message-form/error-message-form.component';
import type { UpdateUserResponse } from '@user/interfaces/update-user-response.interface';
import type { User } from '@auth/interfaces/user.interface';
import type { UpdateUserDto } from '@user/interfaces/update-user-dto.interface';
import type { Address } from '@auth/interfaces/adress.interface';

@Component({
  selector: 'user-form',
  imports: [
    ReactiveFormsModule,
    LoaderComponent,
    SnackbarErrorComponent,
    ErrorMessageFormComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  userService = inject(UserService);
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  formUtils = FormUtils;

  $user = input.required<User>();
  $isEditMode = output<boolean>();
  $updatedUser = signal<UpdateUserDto | null>(null);

  ngOnInit(): void {
    this.setupAddressValidation();
    this.setFormValue(this.$user());
    // this.setFormValue(this.authService.user()!);
  }

  profileForm = this.fb.group({
    nickname: [
      '',
      [
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern(FormUtils.nicknamePattern),
      ],
    ],
    birthday: [
      '',
      [Validators.pattern(FormUtils.birthdayPattern), FormUtils.noFutureDate],
    ],
    street: ['', [Validators.maxLength(50)]],
    city: ['', [Validators.maxLength(50)]],
    location: ['', [Validators.maxLength(50)]],
    country: ['', [Validators.maxLength(50)]],
    zip: ['', [Validators.minLength(4), Validators.maxLength(4)]],
    avatarUrl: [
      '',
      [Validators.pattern(FormUtils.imageUrlPattern)],
      [FormUtils.imageExistsValidator()],
    ],
  });

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

  setFormValue(user: UpdateUserDto) {
    this.profileForm.reset({
      nickname: user.nickname || '',
      birthday: user.birthday
        ? new Date(user.birthday).toISOString().split('T')[0]
        : '',
      avatarUrl: user.avatarUrl || '',
      street: user.address?.street || '',
      city: user.address?.city,
      location: user.address?.location || '',
      country: user.address?.country?.trim() || '',
      zip: user.address?.cp || '',
    });
  }

  private setupAddressValidation(): void {
    const addressFields = ['street', 'city', 'location', 'country', 'zip'];

    addressFields.forEach((field) => {
      const control = this.profileForm.get(field);
      if (!control) return;

      control.valueChanges.subscribe(() => {
        const hasAnyValue = addressFields.some(
          (key) => !!this.profileForm.get(key)?.value
        );

        addressFields.forEach((key) => {
          const ctrl = this.profileForm.get(key);
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

  onSubmit() {
    this.profileForm.markAllAsTouched();
    if (!this.profileForm.valid) return;
    const updatedUser: UpdateUserDto = this.getUpdatedUser();
    this.$updatedUser.set(updatedUser);
  }

  getUpdatedUser(): UpdateUserDto {
    const formValue = this.profileForm.getRawValue();
    const nickname = formValue.nickname?.trim();
    const birthday = formValue.birthday?.trim();
    const avatarUrl = formValue.avatarUrl?.trim();
    const address =
      formValue.street?.trim() !== ''
        ? {
            street: formValue.street?.trim() || '',
            location: formValue.location?.trim() || '',
            city: formValue.city?.trim() || '',
            country: formValue.country?.trim() || '',
            cp: formValue.zip?.toString() || '',
          }
        : undefined;

    return {
      id: this.$user().id,
      birthday: birthday != '' ? new Date(birthday!) : undefined,
      nickname: nickname || undefined,
      avatarUrl: avatarUrl || undefined,
      address,
    };
  }

  $updateUserResource = rxResource({
    request: () => ({ user: this.$updatedUser() }),
    loader: ({ request }) => {
      if (!request.user) return of({} as UpdateUserResponse);
      
      return this.userService.update(request.user).pipe(
        tap((res) => this.authService.updateUser(res.data.user)),
        tap(() => this.$isEditMode.emit(false))
      );
    },
  });
}
