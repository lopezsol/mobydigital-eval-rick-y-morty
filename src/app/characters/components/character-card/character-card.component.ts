import { Component, input } from '@angular/core';
import { Character } from '../../interfaces/character.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'character-card',
  imports: [RouterLink],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.css',
})
export class CharacterCardComponent {
  $character = input.required<Character>()
 }
