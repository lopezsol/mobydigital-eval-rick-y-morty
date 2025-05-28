import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component";

@Component({
  selector: 'character-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './character-layout.component.html',
  styleUrl: './character-layout.component.css',
})
export class CharacterLayoutComponent { }
