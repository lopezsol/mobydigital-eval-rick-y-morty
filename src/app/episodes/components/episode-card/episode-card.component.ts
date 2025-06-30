import { Component, computed, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Episode } from '@episodes/interfaces/episode.interface';

@Component({
  selector: 'episode-card',
  imports: [RouterLink],
  templateUrl: './episode-card.component.html',
  styleUrl: './episode-card.component.css',
})
export class EpisodeCardComponent {
  $episode = input.required<Episode>();
  $favoriteToggled = output<number>();
  $favoriteEpisodes = input.required<number[]>();
  $isFavorite = computed(() => this.$favoriteEpisodes().includes(this.$episode().id));


  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('toggleFavorite');
    this.$favoriteToggled.emit(this.$episode().id);
  }
}
