import { Component, input } from '@angular/core';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';
import type { Episode } from '@episodes/interfaces/episode.interface';

@Component({
  selector: 'episodes-list',
  imports: [EpisodeCardComponent],
  templateUrl: './episodes-list.component.html',
  styleUrl: './episodes-list.component.css',
})
export class EpisodesListComponent {
  $episodes = input.required<Episode[]>();
}
