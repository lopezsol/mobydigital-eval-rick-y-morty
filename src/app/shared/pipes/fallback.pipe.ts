import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallback',
})
export class FallbackPipe implements PipeTransform {
  transform(value: any, fallbackText: string = 'Not defined yet'): string {
    if (value === null || value === undefined || value === '') {
      return fallbackText;
    }
    return value;
  }
}
