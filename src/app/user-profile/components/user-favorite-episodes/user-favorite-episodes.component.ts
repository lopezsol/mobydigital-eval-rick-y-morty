import { Component, inject, input, signal } from '@angular/core';
import { ErrorComponent } from '@shared/components/error/error.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import type { Episode } from '@episodes/interfaces/episode.interface';
@Component({
  selector: 'user-favorite-episodes',
  // imports: [LoaderComponent, ErrorComponent],
  imports: [],
  templateUrl: './user-favorite-episodes.component.html',
  styleUrl: './user-favorite-episodes.component.css',
})
export class UserFavoriteEpisodesComponent {
  $initialLimit = signal(15);
  $favoriteEpisodes = input.required<Episode[]>();
  // $favoriteEpisodes = signal<Episode[]>([
  //   {
  //     id: 28,
  //     name: 'The Ricklantis Mixup',
  //     url: 'https://rickandmortyapi.com/api/episode/28',
  //   },
  // ]);

  updateInitialLimit() {
    this.$initialLimit.update((current) => current + 5);
  }

  shouldShowMoreButton(): boolean {
    const episodes = this.$favoriteEpisodes();
    return (episodes?.length || 0) > this.$initialLimit();
  }

  visibleEpisodes() {
    const episodes = this.$favoriteEpisodes();
    if (!episodes) return [];
    return episodes.slice(0, this.$initialLimit());
  }
}
