import { Component, inject, signal } from '@angular/core';
import { CharactersListComponent } from '../../components/characters-list/characters-list.component';
import { CharacterService } from '../../services/character.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CharacterPaginationComponent } from '../../components/character-pagination/character-pagination.component';
import { of } from 'rxjs';

@Component({
  selector: 'characters-page',
  imports: [CharactersListComponent, CharacterPaginationComponent],
  templateUrl: './characters-page.component.html',
  styleUrl: './characters-page.component.css',
})
export class CharactersPageComponent {
  characterService = inject(CharacterService);
  $page = signal<number>(1);

  $characterResource = rxResource({
    request: () => ({ page: this.$page() }),
    loader: ({ request }) => {
      return this.characterService.getAllCharacters(request.page);
    },
  });

  setPage(page: number) {
    this.$page.set(page);
  }
}
