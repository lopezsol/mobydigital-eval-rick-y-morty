import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { AuthenticatedGuard } from '@auth/guards/authenticated.guard';
import { NotFoundPageComponent } from '@shared/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: 'characters',
    loadChildren: () => import('./characters/character.routes'),
    canMatch: [AuthenticatedGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [NotAuthenticatedGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import(
        './user-profile/pages/user-profile-page/user-profile-page.component'
      ),
    canMatch: [AuthenticatedGuard],
  },
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  { path: '**', component: NotFoundPageComponent },
];
