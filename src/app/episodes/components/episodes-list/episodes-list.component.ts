import { Component, input, output } from '@angular/core';
import { EpisodeCardComponent } from '../episode-card/episode-card.component';
import type { Episode } from '@episodes/interfaces/episode.interface';
import type { UpdateUserDto } from '@user/interfaces/update-user-dto.interface';
import type { User } from '@auth/interfaces/user.interface';

@Component({
  selector: 'episodes-list',
  imports: [EpisodeCardComponent],
  templateUrl: './episodes-list.component.html',
  styleUrl: './episodes-list.component.css',
})
export class EpisodesListComponent {
  $episodes = input.required<Episode[]>();
  $user = input.required<User>()
  $userToUpdate = output<UpdateUserDto>();
}
