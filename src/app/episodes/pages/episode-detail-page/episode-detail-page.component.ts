import { Component, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of, tap } from 'rxjs';
import { EpisodeService } from '@episodes/services/episode.service';
import { ErrorComponent } from '@shared/components/error/error.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { EpisodeInfoComponent } from '@episodes/components/episode-info/episode-info.component';
import { EpisodeCharactersListComponent } from '@episodes/components/episode-characters-list/episode-characters-list.component';
import { CommentListComponent } from '@comments/components/comment-list/comment-list.component';
import { UserService } from '@user/services/user.service';
import { AuthService } from '@auth/services/auth.service';
import type { Episode } from '@episodes/interfaces/episode.interface';
import type { UpdateUserDto } from '@user/interfaces/update-user-dto.interface';

@Component({
  selector: 'episode-detail-page',
  imports: [
    LoaderComponent,
    ErrorComponent,
    EpisodeInfoComponent,
    EpisodeCharactersListComponent,
    CommentListComponent,
    BreadcrumbComponent
],
  templateUrl: './episode-detail-page.component.html',
  styleUrl: './episode-detail-page.component.css',
})
export class EpisodeDetailPageComponent {
  $id = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['id']))
  );
  episodeService = inject(EpisodeService);
  userService = inject(UserService);
  authService = inject(AuthService);
  $userUpdated = signal<UpdateUserDto | null>(null);

  $episodeResource = rxResource({
    request: () => ({ id: this.$id() }),
    loader: ({ request }) => {
      if (!request.id) return of({} as Episode);

      return this.episodeService.getEpisodeById(request.id);
    },
  });

  favoriteEpisodeResource = rxResource({
    request: () => ({ user: this.$userUpdated() }),
    loader: ({ request }) => {
      console.log('entre en reouserce');
      if (!request.user) return of(null);

      return this.userService
        .updateFavoriteEpisodes(request.user)
        .pipe(tap((resp) => this.authService.updateUser(resp.data.user)));
    },
  });
}
