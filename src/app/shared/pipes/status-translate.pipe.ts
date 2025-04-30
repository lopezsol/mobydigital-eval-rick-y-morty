import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../../characters/interfaces/character.interface';

@Pipe({
  name: 'statusTranslate',
})
export class StatusTranslatePipe implements PipeTransform {
  transform(value: string): string {
    if (value === Status.Alive) return 'Vivo';
    if (value === Status.Dead) return 'Muerto';
    return 'Desconocido';
  }
}
