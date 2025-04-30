import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EpisodeService } from '../../../episodes/services/episode.service';
import { firstValueFrom, forkJoin, from, of } from 'rxjs';

@Component({
  selector: 'character-episodes-list',
  imports: [],
  templateUrl: './character-episodes-list.component.html',
  styleUrl: './character-episodes-list.component.css',
})
export class CharacterEpisodesListComponent {
  $episodes = input.required<string[]>();
  $initialLimit = signal(15);
  episodeService = inject(EpisodeService);

  updateInitialLimit() {
    this.$initialLimit.update((current) => current + 5);
  }

  $episodeResource = rxResource({
    request: () => ({ urls: this.$episodes() }),
    loader: ({ request }) => {
      if (!request.urls) return of([]);

      return forkJoin(
        request.urls.map((url) => this.episodeService.getEpisodeByUrl(url))
      );
    },
  });
}
