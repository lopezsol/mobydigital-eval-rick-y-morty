import { Component, input, signal } from '@angular/core';
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
  //TODO: completar la forma en la que se agrega favorito, hay que leer los favoritos del usuario
  $isFavorite = signal(false);

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault()
    console.log('toggleFavorite');
    this.$isFavorite.update((current) => !current);
  }
}
