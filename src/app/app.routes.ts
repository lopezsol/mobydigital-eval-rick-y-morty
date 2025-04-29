import { Routes } from '@angular/router';
import { CharactersPageComponent } from './characters/pages/characters-page/characters-page.component';
import { HomePageComponent } from './shared/pages/home-page/home-page.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: 'characters', component: CharactersPageComponent },
  { path: '**', component: HomePageComponent },
];
