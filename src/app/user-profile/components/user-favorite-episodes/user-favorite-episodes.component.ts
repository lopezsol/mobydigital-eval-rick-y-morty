import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Episode } from '@episodes/interfaces/episode.interface';
@Component({
  selector: 'user-favorite-episodes',
  imports: [RouterLink],
  templateUrl: './user-favorite-episodes.component.html',
  styleUrl: './user-favorite-episodes.component.css',
})
export class UserFavoriteEpisodesComponent {
  $initialLimit = signal(15);
  $favoriteEpisodes = input.required<Episode[]>();

  $favoriteEpisodeToDelete = output<number>();

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
