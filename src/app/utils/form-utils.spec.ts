import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { FormUtils } from './form-utils';

// Mocks para el imageExistsValidator
const mockImageUrl = 'https://via.placeholder.com/150.jpg';
const mockBrokenUrl = 'https://broken-url.com/image.jpg';
const formUtils = FormUtils;

describe('FormUtils', () => {
  describe('getTextError', () => {
    it('should return required error text', () => {
      expect(formUtils.getTextError({ required: true })).toContain(
        'This field is required'
      );
    });

    it('should return minlength error text', () => {
      expect(
        formUtils.getTextError({ minlength: { requiredLength: 5 } })
      ).toContain('Minimum of 5 characters');
    });

    it('should return maxlength error text', () => {
      expect(
        formUtils.getTextError({ maxlength: { requiredLength: 10 } })
      ).toContain('Maximum of 10 characters');
    });

    it('should return min error text', () => {
      expect(formUtils.getTextError({ min: { min: 1 } })).toContain(
        'Minimum value is 1'
      );
    });

    it('should return emailTaken error text', () => {
      expect(formUtils.getTextError({ emailTaken: true })).toContain(
        'This email is already in use'
      );
    });

    it('should return futureDate error text', () => {
      expect(formUtils.getTextError({ futureDate: true })).toContain(
        'Date cannot be in the future'
      );
    });

    it('should return minTrimmedLength error text', () => {
      expect(
        formUtils.getTextError({ minTrimmedLength: { requiredLength: 3 } })
      ).toContain('Minimum of 3 characters');
    });

    it('should return whitespace error text', () => {
      expect(formUtils.getTextError({ whitespace: true })).toContain(
        'The title is empty'
      );
    });

    it('should return imageNotFound error text', () => {
      expect(formUtils.getTextError({ imageNotFound: true })).toContain(
        'The image could not be loaded. Please check the URL.'
      );
    });

    it('should return pattern error for email', () => {
      expect(
        formUtils.getTextError({
          pattern: { requiredPattern: formUtils.emailPattern },
        })
      ).toContain('The value does not look like a valid email address');
    });

    it('should return pattern error for name', () => {
      expect(
        formUtils.getTextError({
          pattern: { requiredPattern: formUtils.namePattern },
        })
      ).toContain('Please enter at least a first and last name');
    });

    it('should return pattern error for birthday', () => {
      expect(
        formUtils.getTextError({
          pattern: { requiredPattern: formUtils.birthdayPattern },
        })
      ).toContain('Date must follow the format YYYY-MM-DD');
    });

    it('should return pattern error for nickname', () => {
      expect(
        formUtils.getTextError({
          pattern: { requiredPattern: formUtils.nicknamePattern },
        })
      ).toContain('Nickname must not contain spaces or symbols');
    });

    it('should return pattern error for image url', () => {
      expect(
        formUtils.getTextError({
          pattern: { requiredPattern: formUtils.imageUrlPattern },
        })
      ).toContain(
        'The URL must start with http/https and end in .jpg, .png, etc.'
      );
    });

    it('should return generic pattern error for unknown pattern', () => {
      expect(
        formUtils.getTextError({
          pattern: { requiredPattern: 'unknownPattern' },
        })
      ).toContain('Pattern does not match the expected format');
    });

    it('should return default error text for unknown error key', () => {
      expect(formUtils.getTextError({ unknown: true })).toContain(
        'Unrecognized validation error: unknown'
      );
    });

    // Línea que hace "return null" al final si no hay errores en el objeto
    it('should return null if errors object is empty', () => {
      expect(formUtils.getTextError({})).toBeNull();
    });
  });

  describe('isInvalidField', () => {
    it('should return true if control has errors and is touched', () => {
      const form = new FormGroup({
        testField: new FormControl(''),
      });
      form.controls['testField'].setErrors({ required: true });
      form.controls['testField'].markAsTouched();

      expect(FormUtils.isInvalidField(form, 'testField')).toBeTrue();
    });

    it('should return false if control has no errors', () => {
      const form = new FormGroup({
        testField: new FormControl('valid'),
      });
      form.controls['testField'].markAsTouched();

      expect(FormUtils.isInvalidField(form, 'testField')).toBeFalse();
    });

    it('should return false if control is not touched', () => {
      const form = new FormGroup({
        testField: new FormControl(''),
      });
      form.controls['testField'].setErrors({ required: true });

      expect(FormUtils.isInvalidField(form, 'testField')).toBeFalse();
    });
  });

  describe('getFieldError', () => {
    it('should return null if control does not exist', () => {
      const form = new FormGroup({});
      expect(FormUtils.getFieldError(form, 'nonExistent')).toBeNull();
    });

    it('should call getTextError with control errors', () => {
      const form = new FormGroup({
        testField: new FormControl(''),
      });
      form.controls['testField'].setErrors({ required: true });
      const spy = spyOn(FormUtils, 'getTextError').and.callThrough();

      FormUtils.getFieldError(form, 'testField');

      expect(spy).toHaveBeenCalledWith({ required: true });
    });

  });

  describe('isFieldOneEqualFieldTwo', () => {
    it('should return null when fields are equal', () => {
      const form = new FormGroup({
        password: new FormControl('1234'),
        repeatPassword: new FormControl('1234'),
      });
      const validator = formUtils.isFieldOneEqualFieldTwo(
        'password',
        'repeatPassword'
      );
      expect(validator(form)).toBeNull();
    });

    it('should return error when fields are different', () => {
      const form = new FormGroup({
        password: new FormControl('1234'),
        repeatPassword: new FormControl('abcd'),
      });
      const validator = formUtils.isFieldOneEqualFieldTwo(
        'password',
        'repeatPassword'
      );
      expect(validator(form)).toEqual({
        passwordsNotEqual: true,
      });
    });
  });

  describe('noFutureDate', () => {
    it('should return null for null or undefined value', () => {
      expect(formUtils.noFutureDate(new FormControl(null))).toBeNull();
      expect(formUtils.noFutureDate(new FormControl(undefined))).toBeNull();
    });

    it('should return null for past date', () => {
      expect(formUtils.noFutureDate(new FormControl('2000-01-01'))).toBeNull();
    });

    it('should return error for future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(
        formUtils.noFutureDate(
          new FormControl(futureDate.toISOString().split('T')[0])
        )
      ).toEqual({ futureDate: true });
    });
  });

  describe('noWhitespaceValidator', () => {
    it('should return error for only whitespace', () => {
      expect(formUtils.noWhitespaceValidator(new FormControl('   '))).toEqual({
        whitespace: true,
      });
    });

    it('should return null for valid text', () => {
      expect(
        formUtils.noWhitespaceValidator(new FormControl('text'))
      ).toBeNull();
    });
  });

  describe('minTrimmedLength', () => {
    it('should return error if trimmed text is too short', () => {
      expect(formUtils.minTrimmedLength(5)(new FormControl('abc'))).toEqual({
        minTrimmedLength: { requiredLength: 5 },
      });
    });

    it('should return null if trimmed text is long enough', () => {
      expect(formUtils.minTrimmedLength(3)(new FormControl('abc'))).toBeNull();
    });
  });

  describe('imageExistsValidator', () => {
    let originalImage: any;

    beforeEach(() => {
      originalImage = (window as any).Image;
    });

    afterEach(() => {
      (window as any).Image = originalImage;
    });

    it('should return null if url is empty', (done) => {
      formUtils
        .imageExistsValidator()(new FormControl(''))
        .subscribe((result) => {
          expect(result).toBeNull();
          done();
        });
    });

    it('should return null for valid image url', (done) => {
      (window as any).Image = class {
        onload: () => void = () => {};
        onerror: () => void = () => {};
        set src(_url: string) {
          setTimeout(() => this.onload(), 0); // Simulate successful load
        }
      };

      formUtils
        .imageExistsValidator()(new FormControl(mockImageUrl))
        .subscribe((result) => {
          expect(result).toBeNull();
          done();
        });
    });

    it('should return error for broken image url', (done) => {
      (window as any).Image = class {
        onload: () => void = () => {};
        onerror: () => void = () => {};
        set src(_url: string) {
          setTimeout(() => this.onerror(), 0); // Simulate load error
        }
      };

      formUtils
        .imageExistsValidator()(new FormControl(mockBrokenUrl))
        .subscribe((result) => {
          expect(result).toEqual({ imageNotFound: true });
          done();
        });
    });
  });
});
