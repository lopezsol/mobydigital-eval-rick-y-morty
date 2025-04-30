import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'characters',
    loadChildren: () => import('./characters/character.routes'),
  },
  { path: '**', component: HomePageComponent },
];
