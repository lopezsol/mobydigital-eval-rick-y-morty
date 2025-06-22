import { Component, input } from '@angular/core';
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
}
