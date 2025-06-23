import { Component, input, output } from '@angular/core';
import { CommentDropdown } from '@shared/enums/comment-dropdown.enum';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
})
export class DropdownComponent {
  $type = input.required<CommentDropdown>();
  $edit = output<void>();
  $delete = output<void>();
  $disableComments = output<void>();

  comentDropdown = CommentDropdown;
}
