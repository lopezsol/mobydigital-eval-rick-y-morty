import { Component } from '@angular/core';
import { SnackbarErrorComponent } from './snackbar-error.component';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('SnackbarErrorComponent', () => {
  @Component({
    template: `
      <app-snackbar-error [$snackbarMessage]="mockMessage"></app-snackbar-error>
    `,
    standalone: true,
    imports: [SnackbarErrorComponent],
  })
  class SnackbarErrorWrapperComponent {
    mockMessage = 'Error al mostrar los datos del usuario';
  }

  let fixture: any;
  let wrapper: any;
  let component: SnackbarErrorComponent;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      imports: [SnackbarErrorWrapperComponent],
    }).createComponent(SnackbarErrorWrapperComponent);

    wrapper = fixture.componentInstance;
    fixture.detectChanges();
    component = fixture.debugElement.query(
      By.directive(SnackbarErrorComponent)
    ).componentInstance;
  });

  it('should activate and deactivate the snackbar using show()', fakeAsync(() => {
    // Llama directamente a show()
    component.show();
    expect(component.$showSnackbar()).toBeTrue();

    // Avanza el tiempo simulado
    tick(3000);
    expect(component.$showSnackbar()).toBeFalse();
  }));
});
