import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { NotFoundPageComponent } from './shared/pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: 'characters',
    loadChildren: () => import('./characters/character.routes'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    // canMatch: [
    //   // () => {
    //   //   console.log('hola Mundo');
    //   //   return true;
    //   // },
    //   NotAuthenticatedGuard,
    // ],
  },
  { path: '', component: HomePageComponent },
  { path: '**', component: NotFoundPageComponent },
];
