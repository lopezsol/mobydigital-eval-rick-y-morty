import { Component, computed, inject, input } from '@angular/core';
import { Character } from '../../interfaces/character.interface';
import { LocationService } from '../../../locations/services/location.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { Location } from '../../../locations/interfaces/location.interface';

@Component({
  selector: 'character-info',
  imports: [],
  templateUrl: './character-info.component.html',
  styleUrl: './character-info.component.css',
})
export class CharacterInfoComponent {
  $character = input.required<Character>();
  locationService = inject(LocationService);

  $urlLocation = computed(() => this.$character().location.url);
  $urlOrigin = computed(() => this.$character().origin.url);

  $locationResource = rxResource({
    request: () => ({ url: this.$urlLocation() }),
    loader: ({ request }) => {
      if (!request.url) return of({} as Location);

      return this.locationService.getLocationByUrl(request.url);
    },
  });
  $originResource = rxResource({
    request: () => ({ url: this.$urlOrigin() }),
    loader: ({ request }) => {
      if (!request.url) return of({} as Location);

      return this.locationService.getLocationByUrl(request.url);
    },
  });
}
