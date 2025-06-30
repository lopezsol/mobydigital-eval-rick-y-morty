import type { Address } from './adress.interface';

export interface User {
  id: string;
  role: string;
  name: string;
  mail: string;
  address?: Address;
  birthday?: Date;
  phone?: string;
  nickname?: string;
  favoriteEpisodes?: number[],
  avatarUrl?: string
}
