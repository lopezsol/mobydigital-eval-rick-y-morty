import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EpisodeService } from '../../../episodes/services/episode.service';
import { forkJoin, of } from 'rxjs';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ErrorComponent } from '../../../shared/components/error/error.component';

@Component({
  selector: 'character-episodes-list',
  imports: [LoaderComponent, ErrorComponent],
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

  shouldShowMoreButton(): boolean {
    const episodes = this.$episodeResource.value();
    return (episodes?.length || 0) > this.$initialLimit();
  }

  visibleEpisodes() {
    const episodes = this.$episodeResource.value();
    if (!episodes) return [];
    return episodes.slice(0, this.$initialLimit());
  }
}
