import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'avatarFallback',
})
export class AvatarFallbackPipe implements PipeTransform {
  transform(avatarUrl: string | null | undefined): string {
    if (!avatarUrl) return 'assets/images/profile-picture-default.webp';
    return avatarUrl;
  }
}
