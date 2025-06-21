import { Component, computed, input, signal } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import type { Address } from '@auth/interfaces/adress.interface';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'user-info',
  imports: [UserFormComponent],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent {
  $user = input.required<User>();
  $isEditMode = signal(false);
  $userAdress = computed(() => this.getFullAddress(this.$user().address));

  getFullAddress(address?: Address): string {
    if (!address) return '';

    const { street, city, location, country, cp } = address;
    return `${street}, ${city}, ${location}, ${country}, ${cp}`;
  }
}
