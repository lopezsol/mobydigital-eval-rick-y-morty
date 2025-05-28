import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { NavbarAuthComponent } from '../../../auth/components/navbar-auth/navbar-auth.component';
import { NavbarMainComponent } from '../navbar-main/navbar-main.component';
import { AuthStatus } from '@auth/enums/auth-status.enum';

@Component({
  selector: 'app-navbar',
  imports: [NavbarAuthComponent, NavbarMainComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  $isAuthenticated = computed(
    () => this.authService.$authStatus() === AuthStatus.Authenticated
  );
}
