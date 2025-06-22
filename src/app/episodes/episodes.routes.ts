import { Routes } from '@angular/router';
import { EpisodeLayoutComponent } from './layouts/episode-layout/episode-layout.component';
import { EpisodesPageComponent } from './pages/episodes-page/episodes-page.component';
import { EpisodeDetailPageComponent } from './pages/episode-detail-page/episode-detail-page.component';

export const episodeRoutes: Routes = [
  {
    path: '',
    component: EpisodeLayoutComponent,
    children: [
      {
        path: '',
        component: EpisodesPageComponent,
      },
      {
        path: ':id',
        component: EpisodeDetailPageComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
];

export default episodeRoutes;
