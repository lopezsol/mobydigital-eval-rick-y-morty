import { Component, input } from '@angular/core';
import type { Episode } from '@episodes/interfaces/episode.interface';

@Component({
  selector: 'episode-info',
  imports: [],
  templateUrl: './episode-info.component.html',
  styleUrl: './episode-info.component.css',
})
export class EpisodeInfoComponent {
  $episode = input.required<Episode>();
}
