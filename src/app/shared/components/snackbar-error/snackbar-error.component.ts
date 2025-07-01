import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-snackbar-error',
  imports: [],
  templateUrl: './snackbar-error.component.html',
  styleUrl: './snackbar-error.component.css',
})
export class SnackbarErrorComponent {
  $snackbarMessage = input.required<string>();
  $showSnackbar = signal<boolean>(false);

  ngOnInit() {
    this.show();
  }

  show() {
    this.$showSnackbar.set(true);
    setTimeout(() => {
      this.$showSnackbar.set(false);
    }, 3000);
  }
}
