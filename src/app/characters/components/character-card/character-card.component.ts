import { Component, input } from '@angular/core';
import { Character } from '../../interfaces/character.interface';

@Component({
  selector: 'character-card',
  imports: [],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.css',
})
export class CharacterCardComponent {
  $character = input.required<Character>()
 }
