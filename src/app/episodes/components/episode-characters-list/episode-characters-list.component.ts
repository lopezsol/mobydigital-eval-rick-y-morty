import { Component, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ErrorComponent } from '@shared/components/error/error.component';
import { CharacterService } from '@characters/services/character.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'episode-characters-list',
  imports: [LoaderComponent, ErrorComponent, RouterLink],
  templateUrl: './episode-characters-list.component.html',
  styleUrl: './episode-characters-list.component.css',
})
export class EpisodeCharactersListComponent {
  $characters = input.required<string[]>();
  $initialLimit = signal(15);
  characterService = inject(CharacterService)
  
  updateInitialLimit() {
    this.$initialLimit.update((current) => current + 5);
  }

  $characterResource = rxResource({
    request: () => ({ urls: this.$characters() }),
    loader: ({ request }) => {
      if (!request.urls) return of([]);

      return forkJoin(
        request.urls.map((url) => this.characterService.getCharacterByUrl(url))
      );
    },
  });

  shouldShowMoreButton(): boolean {
    const characters = this.$characterResource.value();
    return (characters?.length || 0) > this.$initialLimit();
  }

  visibleCharacters() {
    const characters = this.$characterResource.value();
    if (!characters) return [];
    return characters.slice(0, this.$initialLimit());
  }
}
