import { Component, effect, input, output, signal } from '@angular/core';

@Component({
  selector: 'error-alert',
  imports: [],
  templateUrl: './error-alert.component.html',
  styleUrl: './error-alert.component.css',
})
export class ErrorAlertComponent {
  $errorMessage = input.required<string>();
  $visible = signal(true);
  $hideAlert = output<boolean>();

  // constructor() {
  //   effect(() => {
  //     this.$visible.set(true);
  //     setTimeout(() => this.$visible.set(false), 2000);
  //   });
  // }

  // Assign the effect to a variable to avoid implicit 'any' return type error
  private _autoHideEffect = effect((): void => {
    this.$visible.set(true);
    setTimeout(() => {
      this.$visible.set(false);
      this.$hideAlert.emit(true);
    }, 2000);
  });
}
