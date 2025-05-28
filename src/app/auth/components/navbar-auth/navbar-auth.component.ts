import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'navbar-auth',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-auth.component.html',
  styleUrl: './navbar-auth.component.css',
})
export class NavbarAuthComponent { }
