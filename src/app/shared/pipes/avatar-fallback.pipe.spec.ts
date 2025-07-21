import { AvatarFallbackPipe } from './avatar-fallback.pipe';

describe('AvatarFallbackPipe', () => {
  let pipe: AvatarFallbackPipe;

  beforeEach(() => {
    pipe = new AvatarFallbackPipe();
  });

  it('should return the fallback image when avatarUrl is null', () => {
    const result = pipe.transform(null);
    expect(result).toBe('assets/images/profile-picture-default.webp');
  });

  it('should return the fallback image when avatarUrl is undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('assets/images/profile-picture-default.webp');
  });

  it('should return the avatarUrl when it is defined', () => {
    const result = pipe.transform('https://example.com/avatar.jpg');
    expect(result).toBe('https://example.com/avatar.jpg');
  });
});
