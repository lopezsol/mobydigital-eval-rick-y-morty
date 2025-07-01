import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, of } from 'rxjs';
import { CharacterService } from '../../services/character.service';
import { CharacterEpisodesComponent } from '@characters/components/character-episodes/character-episodes.component';
import { CharacterInfoComponent } from '@characters/components/character-info/character-info.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { ErrorComponent } from '@shared/components/error/error.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import type { Character } from '@characters/interfaces/character.interface';

@Component({
  selector: 'app-character-detail-page',
  imports: [
    CharacterInfoComponent,
    CharacterEpisodesComponent,
    LoaderComponent,
    ErrorComponent,
    BreadcrumbComponent,
  ],
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
