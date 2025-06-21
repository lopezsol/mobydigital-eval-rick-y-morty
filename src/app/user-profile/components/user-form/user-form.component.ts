import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';
import { UserService } from '@user/services/user.service';
import { AuthService } from '@auth/services/auth.service';
import { ErrorMessageComponent } from '@shared/components/error-message/error-message.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { SnackbarErrorComponent } from '@shared/components/snackbar-error/snackbar-error.component';
import type { UpdateUserResponse } from '@user/interfaces/update-user-response.interface';
import type { User } from '@auth/interfaces/user.interface';
import type { UpdateUserDto } from '@user/interfaces/update-user-dto.interface';

@Component({
  selector: 'user-form',
  imports: [
    ReactiveFormsModule,
    ErrorMessageComponent,
    LoaderComponent,
    SnackbarErrorComponent
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
    birthday: ['', [Validators.pattern(FormUtils.birthdayPattern)]],
    street: ['', [Validators.maxLength(50)]],
    city: ['', [Validators.maxLength(50)]],
    location: ['', [Validators.maxLength(50)]],
    country: ['', [Validators.maxLength(50)]],
    zip: ['', [Validators.minLength(4), Validators.maxLength(4)]],
    profilePictureUrl: ['', [Validators.maxLength(100)]],
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
      profilePictureUrl: user.profilePictureUrl || '',
      street: user.address?.street || '',
      city: user.address?.city,
      location: user.address?.location || '',
      country: user.address?.country?.trim() || '',
      zip: user.address?.cp || '',
    });
  }

  private setupAddressValidation(): void {
    const addressFields = ['street', 'city', 'location', 'state', 'zip'];

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
      case 'street':
      case 'city':
      case 'location':
      case 'state':
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

    // const newUser = this.createUser();
    // this.$newUser.set(newUser);
  }

  getUpdatedUser(): UpdateUserDto {
    const {
      birthday,
      city = this.$user().address?.city,
      location = this.$user().address?.location,
      nickname = this.$user().nickname,
      profilePictureUrl = this.$user().profilePictureUrl,
      country = this.$user().address?.country,
      street = this.$user().address?.street,
      zip = this.$user().address?.cp,
    } = this.profileForm.value;

    const parsedBirthday = birthday
      ? new Date(birthday)
      : this.$user().birthday;

    const address = street
      ? {
          street: street!,
          location: location!,
          city: city!,
          country: country!,
          cp: zip?.toString()!,
        }
      : undefined;

    const updatedUser: UpdateUserDto = {
      id: this.$user().id,
      name: this.$user().name,
      birthday: parsedBirthday,
      // nickname: nickname!, TODO: agregarlos cuando haga mi be
      // profilePictureUrl: profilePictureUrl!,
      address: address,
    };
    return updatedUser;
  }

  $updateUserResource = rxResource({
    request: () => ({ user: this.$updatedUser() }),
    loader: ({ request }) => {
      if (!request.user) return of({} as UpdateUserResponse);

      console.log(request.user);
      return this.userService
        .update(request.user)
        .pipe(
          tap((userResponse) => this.authService.updateUser(userResponse.user)),
          tap(() => this.$isEditMode.emit(false))
        );
    },
  });
}
