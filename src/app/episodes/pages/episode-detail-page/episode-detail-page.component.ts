import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { EpisodeService } from '@episodes/services/episode.service';
import { ErrorComponent } from '@shared/components/error/error.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { EpisodeInfoComponent } from '@episodes/components/episode-info/episode-info.component';
import { EpisodeCharactersListComponent } from '@episodes/components/episode-characters-list/episode-characters-list.component';
import type { Episode } from '@episodes/interfaces/episode.interface';

@Component({
  selector: 'episode-detail-page',
  imports: [
    LoaderComponent,
    ErrorComponent,
    EpisodeInfoComponent,
    EpisodeCharactersListComponent,
  ],
  templateUrl: './episode-detail-page.component.html',
  styleUrl: './episode-detail-page.component.css',
})
export class EpisodeDetailPageComponent {
  $id = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['id']))
  );
  episodeService = inject(EpisodeService);

  $episodeResource = rxResource({
    request: () => ({ id: this.$id() }),
    loader: ({ request }) => {
      if (!request.id) return of({} as Episode);

      return this.episodeService.getEpisodeById(request.id);
    },
  });
}
