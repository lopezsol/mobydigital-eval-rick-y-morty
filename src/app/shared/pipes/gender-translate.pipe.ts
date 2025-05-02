import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '../../characters/interfaces/gender.interface';

@Pipe({
  name: 'genderTranslate',
})
export class GenderTranslatePipe implements PipeTransform {
  transform(value: string): string {
    if (value === Gender.Female) return 'Femenino';
    if (value === Gender.Male) return 'Masculino';
    if (value === Gender.Genderless) return 'Sin género';

    return 'Desconocido';
  }
}
