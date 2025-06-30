import { Component, computed, input, output, signal } from '@angular/core';
import type { User } from '@auth/interfaces/user.interface';
import type { Episode } from '@episodes/interfaces/episode.interface';
import type { UpdateUserDto } from '@user/interfaces/update-user-dto.interface';

@Component({
  selector: 'episode-info',
  imports: [],
  templateUrl: './episode-info.component.html',
  styleUrl: './episode-info.component.css',
})
export class EpisodeInfoComponent {
  $episode = input.required<Episode>();
  $user = input.required<User>();
  $userToUpdate = output<UpdateUserDto>();

  $favoriteEpisodes = computed(() => this.$user().favoriteEpisodes || []);
  $isFavorite = computed(() =>
    this.$favoriteEpisodes().includes(this.$episode().id)
  );

  toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    console.log('toggle', this.$episode().id);
    const episodeId = this.$episode().id;
    const favoriteEpisodes = this.$user()?.favoriteEpisodes?.includes(episodeId)
      ? this.$user()?.favoriteEpisodes?.filter((id) => id !== episodeId)
      : [...(this.$user()?.favoriteEpisodes ?? []), episodeId];

    this.$userToUpdate.emit({
      id: this.$user()?.id!,
      favoriteEpisodes,
    });
  }
}
