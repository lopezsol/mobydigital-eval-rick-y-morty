import { Component, input } from '@angular/core';

@Component({
  selector: 'error-alert',
  imports: [],
  templateUrl: './error-alert.component.html',
  styleUrl: './error-alert.component.css',
})
export class ErrorAlertComponent {
  $errorMessage = input.required<string>();
}
