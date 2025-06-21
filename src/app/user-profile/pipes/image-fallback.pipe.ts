import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageFallback',
})
export class ImageFallbackPipe implements PipeTransform {
  transform(imageUrl: string | null | undefined): string {
    if (!imageUrl) return 'assets/images/profile-picture-default.webp';
    return imageUrl;
  }
}
