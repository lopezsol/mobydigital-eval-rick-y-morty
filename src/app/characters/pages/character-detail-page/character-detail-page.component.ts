import { Component, inject } from '@angular/core';
import { CharacterInfoComponent } from '../../components/character-info/character-info.component';
import { CharacterEpisodesListComponent } from '../../components/character-episodes-list/character-episodes-list.component';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../interfaces/character.interface';

@Component({
  selector: 'app-character-detail-page',
  imports: [CharacterInfoComponent, CharacterEpisodesListComponent],
  templateUrl: './character-detail-page.component.html',
  styleUrl: './character-detail-page.component.css',
})
export class CharacterDetailPageComponent {
  $id = toSignal(
    inject(ActivatedRoute).params.pipe(map((params) => params['id']))
  );
  characterService = inject(CharacterService);

  $characterResource = rxResource({
    request: () => ({ id: this.$id() }),
    loader: ({ request }) => {
      if (!request.id) return of({} as Character);

      return this.characterService.getCharacterById(request.id);
    },
  });
}
