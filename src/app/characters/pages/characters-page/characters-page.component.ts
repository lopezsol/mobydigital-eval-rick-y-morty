import { Component, inject } from '@angular/core';
import { CharactersListComponent } from '../../components/characters-list/characters-list.component';
import { CharacterService } from '../../services/character.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'characters-page',
  imports: [CharactersListComponent],
  templateUrl: './characters-page.component.html',
  styleUrl: './characters-page.component.css',
})
export class CharactersPageComponent {
  characterService = inject(CharacterService);

  $characterResource = rxResource({
    request: () => ({}),
    loader: ({ request }) => {
      return this.characterService.getAllCharacters();
    },
  });
}
