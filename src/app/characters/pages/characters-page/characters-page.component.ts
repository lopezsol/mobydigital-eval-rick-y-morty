import { Component, inject, signal } from '@angular/core';
import { CharactersListComponent } from '../../components/characters-list/characters-list.component';
import { CharacterService } from '../../services/character.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CharacterPaginationComponent } from '../../components/character-pagination/character-pagination.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ErrorComponent } from '../../../shared/components/error/error.component';
import { CharacterSearchComponent } from '../../components/character-search/character-search.component';

@Component({
  selector: 'characters-page',
  imports: [
    CharactersListComponent,
    CharacterPaginationComponent,
    LoaderComponent,
    ErrorComponent,
    CharacterSearchComponent,
  ],
  templateUrl: './characters-page.component.html',
  styleUrl: './characters-page.component.css',
})
export class CharactersPageComponent {
  characterService = inject(CharacterService);
  $page = signal<number>(1);
  $query = signal<string>('');

  $characterResource = rxResource({
    request: () => ({ page: this.$page(), query: this.$query() }),
    loader: ({ request }) => {
      if (request.query) {
        return this.characterService.getAllCharactersByName(
          request.query,
          request.page
        );
      }
      return this.characterService.getAllCharacters(request.page);
    },
  });

  setPage(page: number) {
    this.$page.set(page);
  }

  setQuery(query: string) {
    this.$query.set(query);
    this.$page.set(1);
  }
}
