import { Routes } from '@angular/router';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'characters',
    loadChildren: () => import('./characters/character.routes'),
  },
  { path: '**', component: NotFoundComponent },
];
