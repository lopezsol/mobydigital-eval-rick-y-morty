import { Routes } from '@angular/router';
import { CharacterLayoutComponent } from './layouts/character-layout/character-layout.component';
import { CharactersPageComponent } from './pages/characters-page/characters-page.component';
import { CharacterDetailPageComponent } from './pages/character-detail-page/character-detail-page.component';

export const characterRoutes: Routes = [
  {
    path: '',
    component: CharacterLayoutComponent,
    children: [
      {
        path: '',
        component: CharactersPageComponent,
      },
      {
        path: ':id',
        component: CharacterDetailPageComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default characterRoutes;
