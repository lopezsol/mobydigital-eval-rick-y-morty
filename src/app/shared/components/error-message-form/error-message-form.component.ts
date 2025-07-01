import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-message-form',
  imports: [],
  templateUrl: './error-message-form.component.html',
  styleUrl: './error-message-form.component.css',
})
export class ErrorMessageFormComponent {
  $message = input.required<string>();
}
