import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export class FormUtils {
  // static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static namePattern = '^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)(\\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
        case 'maxlength':
          return `Máximo de ${errors['maxlength'].requiredLength} caracteres.`;
        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;
        case 'emailTaken':
          return `El correo electrónico ya está siendo usado por otro usuario`;
        case 'fullName':
          return 'Debe ingresar al menos nombre y apellido';
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no luce como un correo electrónico';
          }
          if (errors['pattern'].requiredPattern === FormUtils.namePattern) {
            return 'Debe ingresar al menos nombre y apellido';
          }

          return 'Error de patrón contra expresión regular';

        default:
          return `Error de validación no controlado ${key}`;
      }
    }

    return null;
  }

  static isInvalidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldInArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(
    formArray: FormArray,
    index: number
  ): string | null {
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { passwordsNotEqual: true };
    };
  }

  //TODO: mejorar validador de nombre
  // static fullNameValidator(control: AbstractControl): ValidationErrors | null {
  //   const value = control.value?.trim();

  //   if (!value) return { fullName: true }; // está vacío o son solo espacios

  //   const words = value.split(/\s+/).filter((word: string) => word.length > 0);

  //   return words.length >= 2 ? null : { fullName: true };
  // }

  //   static async checkingServerResponse(
  //     control: AbstractControl
  //   ): Promise<ValidationErrors | null> {
  //     console.log('Validando contra servidor');

  //     await sleep();

  //     const formValue = control.value;

  //     if (formValue === 'hola@mundo.com') {
  //       return {
  //         emailTaken: true,
  //       };
  //     }

  //     return null;
  //   }
}
