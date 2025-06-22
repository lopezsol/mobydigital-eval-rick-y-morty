import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EpisodesListComponent } from '@episodes/components/episodes-list/episodes-list.component';
import { EpisodeService } from '@episodes/services/episode.service';
import { ErrorComponent } from '@shared/components/error/error.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { SearchComponent } from '@shared/components/search/search.component';

@Component({
  selector: 'episodes-page',
  imports: [
    LoaderComponent,
    ErrorComponent,
    PaginationComponent,
    SearchComponent,
    EpisodesListComponent
],
  templateUrl: './episodes-page.component.html',
  styleUrl: './episodes-page.component.css',
})
export class EpisodesPageComponent {
  episodeService = inject(EpisodeService);
  $page = signal<number>(1);
  $query = signal<string>('');

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
}
