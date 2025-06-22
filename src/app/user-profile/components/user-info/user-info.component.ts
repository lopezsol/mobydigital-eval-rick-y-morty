import { Component, computed, input, signal } from '@angular/core';
import { UserFormComponent } from '../user-form/user-form.component';
import { AvatarFallbackPipe } from '@shared/pipes/avatar-fallback.pipe';
import { DatePipe } from '@angular/common';
import { FallbackPipe } from '@shared/pipes/fallback.pipe';
import type { User } from '@auth/interfaces/user.interface';
import type { Address } from '@auth/interfaces/adress.interface';
@Component({
  selector: 'user-info',
  imports: [UserFormComponent, AvatarFallbackPipe, DatePipe, FallbackPipe],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css',
})
export class UserInfoComponent {
  $user = input.required<User>();
  $isEditMode = signal(false);
  $userAdress = computed(() => this.getFullAddress(this.$user().address));

  getFullAddress(address?: Address): string {
    if (!address?.street) return '';

    const { street, city, location, country, cp } = address;
    return `${street}, ${city}, ${location}, ${country}, ${cp}`;
  }
}
