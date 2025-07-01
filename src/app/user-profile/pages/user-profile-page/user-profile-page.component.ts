import { Component, inject, signal } from '@angular/core';
import { forkJoin, map, of, tap } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth/services/auth.service';
import { EpisodeService } from '@episodes/services/episode.service';
import { UserFavoriteEpisodesComponent } from '@user/components/user-favorite-episodes/user-favorite-episodes.component';
import { UserInfoComponent } from '@user/components/user-info/user-info.component';
import { UserService } from '@user/services/user.service';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { SnackbarErrorComponent } from '@shared/components/snackbar-error/snackbar-error.component';

@Component({
  selector: 'user-profile-page',
  imports: [
    UserInfoComponent,
    UserFavoriteEpisodesComponent,
    BreadcrumbComponent,
    LoaderComponent,
    SnackbarErrorComponent
],
  templateUrl: './user-profile-page.component.html',
  styleUrl: './user-profile-page.component.css',
})
export default class UserProfilePageComponent {
  authService = inject(AuthService);
  userService = inject(UserService);
  episodeService = inject(EpisodeService);
  $favoriteEpisodeDeleted = signal<number | null>(null);

  $favoriteEpisodes = signal(this.authService.user()!.favoriteEpisodes);
  $isEditMode = signal(false);

  favoriteEpisodesResource = rxResource({
    request: () => ({ ids: this.$favoriteEpisodes() }),
    loader: ({ request }) => {
      if (!request.ids || request.ids.length === 0) return of([]);

      return forkJoin(
        request.ids.map((id) => this.episodeService.getEpisodeById(id))
      ).pipe(
        map((episodes) =>
          episodes.filter((e) => e != null).sort((a, b) => a.id - b.id)
        )
      );
    },
  });

  deletefavoriteEpisodeResource = rxResource({
    request: () => ({ episodeId: this.$favoriteEpisodeDeleted() }),
    loader: ({ request }) => {
      if (!request.episodeId) return of(null);

      const favoriteEpisodes = this.authService
        .user()
        ?.favoriteEpisodes?.filter((id) => id !== request.episodeId);
      return this.userService
        .updateFavoriteEpisodes({
          id: this.authService.user()?.id!,
          favoriteEpisodes,
        })
        .pipe(
          tap((resp) => this.authService.updateUser(resp.data.user)),
          tap((resp) =>
            this.$favoriteEpisodes.set(resp.data.user.favoriteEpisodes)
          )
        );
    },
  });
}
