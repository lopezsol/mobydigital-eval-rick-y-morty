export interface Character {
  id: number;
  created: string;
  episode: string[];
  gender: Gender | string;
  image: string;
  location: Location;
  name: string;
  origin: Location;
  species: string;
  status: Status | string;
  type: string;
  url: string;
}

export enum Gender {
  Female = 'Female',
  Genderless = 'Genderless',
  Male = 'Male',
  Unknown = 'unknown',
}

export interface Location {
  name: string;
  url: string;
}

export enum Status {
  Alive = 'Alive',
  Dead = 'Dead',
  Unknown = 'unknown',
}
