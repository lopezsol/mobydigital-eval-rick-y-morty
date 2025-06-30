import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth/services/auth.service';
import { EpisodeService } from '@episodes/services/episode.service';
import { UserFavoriteEpisodesComponent } from '@user/components/user-favorite-episodes/user-favorite-episodes.component';
import { UserInfoComponent } from '@user/components/user-info/user-info.component';
import { UserService } from '@user/services/user.service';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'user-profile-page',
  imports: [UserInfoComponent, UserFavoriteEpisodesComponent],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css',
})
export default class UserProfilePageComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  episodeService = inject(EpisodeService);

  $favoriteEpisodes = signal(this.authService.user()!.favoriteEpisodes);
  $isEditMode = signal(false);

  $favoriteEpisodesResource = rxResource({
    request: () => ({ ids: this.$favoriteEpisodes() }),
    loader: ({ request }) => {
      if (!request.ids) return of([]);

      return forkJoin(
        request.ids.map((id) => this.episodeService.getEpisodeById(id))
      );
    },
  });
}
