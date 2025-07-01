import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static namePattern = '^([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)(\\s[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$';
  static nicknamePattern = '^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static birthdayPattern = '^\\d{4}-\\d{2}-\\d{2}$';
  static imageUrlPattern =
    '^https?:\\/\\/.*\\.(jpg|jpeg|png|gif|webp)(\\?.*)?$';

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'This field is required';
        case 'minlength':
          return `Minimum of ${errors['minlength'].requiredLength} characters`;
        case 'maxlength':
          return `Maximum of ${errors['maxlength'].requiredLength} characters`;
        case 'min':
          return `Minimum value is ${errors['min'].min}`;
        case 'emailTaken':
          return `This email is already in use`;
        case 'futureDate':
          return 'Date cannot be in the future';
        case 'minTrimmedLength':
          return `Minimum of ${errors['minTrimmedLength'].requiredLength} characters`;
        case 'whitespace':
          return 'The title is empty';

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'The value does not look like a valid email address';
          }
          if (errors['pattern'].requiredPattern === FormUtils.namePattern) {
            return 'Please enter at least a first and last name';
          }
          if (errors['pattern'].requiredPattern === FormUtils.birthdayPattern) {
            return 'Date must follow the format YYYY-MM-DD';
          }
          if (errors['pattern'].requiredPattern === FormUtils.nicknamePattern) {
            return 'Nickname must not contain spaces or symbols';
          }
          if (errors['pattern'].requiredPattern === FormUtils.imageUrlPattern) {
            return 'The URL must start with http/https and end in .jpg, .png, etc.';
          }
          return 'Pattern does not match the expected format';
        default:
          return `Unrecognized validation error: ${key}`;
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

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;

      return field1Value === field2Value ? null : { passwordsNotEqual: true };
    };
  }

  static noFutureDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) return null;

    const input = new Date(value);
    const inputDateStr = input.toISOString().split('T')[0];

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return inputDateStr > todayStr ? { futureDate: true } : null;
  }

  static noWhitespaceValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  static minTrimmedLength(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const trimmed = control.value?.trim();
      if (trimmed?.length < min) {
        return {
          minTrimmedLength: {
            requiredLength: min,
          },
        };
      }
      return null;
    };
  }
}
