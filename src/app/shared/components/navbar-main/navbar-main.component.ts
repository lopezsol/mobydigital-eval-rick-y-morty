import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStatus } from '@auth/enums/auth-status.enum';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'navbar-main',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-main.component.html',
  styleUrl: './navbar-main.component.css',
})
export class NavbarMainComponent {
  authService = inject(AuthService);
  router = inject(Router);

  $isAuthenticated = computed(
    () => this.authService.$authStatus() === AuthStatus.Authenticated
  );

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
