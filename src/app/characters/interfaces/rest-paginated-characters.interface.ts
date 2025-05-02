import { Gender } from './gender.interface';
import { LocationSummary } from './location-summary.interface';
import { Status } from './status.interface';

export interface RestPaginatedCharacters {
  info: RestPaginationInfo;
  results: RestCharacter[];
}

export interface RestPaginationInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface RestCharacter {
  id: number;
  name: string;
  status: Status;
  species: Species;
  type: string;
  gender: Gender;
  origin: LocationSummary;
  location: LocationSummary;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export enum Species {
  Alien = 'Alien',
  Human = 'Human',
}
