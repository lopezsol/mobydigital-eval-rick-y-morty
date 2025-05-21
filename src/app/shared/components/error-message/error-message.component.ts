import { Component, input } from '@angular/core';

@Component({
  selector: 'error-message',
  imports: [],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css',
})
export class ErrorMessageComponent {
  $message = input.required<string>();
}
