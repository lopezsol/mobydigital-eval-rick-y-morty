import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';
import { AuthService } from '@auth/services/auth.service';
import { EpisodesListComponent } from '@episodes/components/episodes-list/episodes-list.component';
import { EpisodeService } from '@episodes/services/episode.service';
import { ErrorComponent } from '@shared/components/error/error.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SearchComponent } from '@shared/components/search/search.component';
import { UserService } from '@user/services/user.service';
import type { UpdateUserDto } from '@user/interfaces/update-user-dto.interface';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'episodes-page',
  imports: [
    LoaderComponent,
    ErrorComponent,
    PaginationComponent,
    SearchComponent,
    EpisodesListComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './episodes-page.component.html',
  styleUrl: './episodes-page.component.css',
})
export class EpisodesPageComponent {
  episodeService = inject(EpisodeService);
  userService = inject(UserService);
  authService = inject(AuthService);

  $page = signal<number>(1);
  $query = signal<string>('');
  $favoriteEpisode = signal<number | null>(null);
  $userUpdated = signal<UpdateUserDto | null>(null);

  $episodeResource = rxResource({
    request: () => ({ page: this.$page(), query: this.$query() }),
    loader: ({ request }) => {
      if (request.query) {
        return this.episodeService.getAllEpisodesByName(
          request.query,
          request.page
        );
      }
      return this.episodeService.getAllEpisodes(request.page);
    },
  });

  setPage(page: number) {
    this.$page.set(page);
  }

  setQuery(query: string) {
    this.$query.set(query);
    this.$page.set(1);
  }

  favoriteEpisodeResource = rxResource({
    request: () => ({ user: this.$userUpdated() }),
    loader: ({ request }) => {
      if (!request.user) return of(null);

      return this.userService
        .updateFavoriteEpisodes({
          id: this.authService.user()?.id!,
          favoriteEpisodes: request.user.favoriteEpisodes || [],
        })
        .pipe(tap((resp) => this.authService.updateUser(resp.data.user)));
    },
  });
}
