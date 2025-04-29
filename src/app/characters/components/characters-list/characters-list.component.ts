import { Component, input } from '@angular/core';
import { Character } from '../../interfaces/character.interface';
import { CharacterCardComponent } from "../character-card/character-card.component";


@Component({
  selector: 'characters-list',
  imports: [CharacterCardComponent],
  templateUrl: './characters-list.component.html',
  styleUrl: './characters-list.component.css',
})
export class CharactersListComponent {
  $characters = input.required<Character[]>()
}
