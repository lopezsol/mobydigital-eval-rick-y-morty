import { Address } from '@auth/interfaces/adress.interface';

export interface UpdateUserDto {
  id: string;
  name?: string;
  address?: Address;
  birthday?: Date;
  nickname?: string;
  favoriteEpisodes?: number[];
  avatarUrl?: string;
}
