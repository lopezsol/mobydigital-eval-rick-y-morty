import { Gender } from "./gender.interface";
import { LocationSummary } from "./location-summary.interface";
import { Status } from "./status.interface";

export interface Character {
  id: number;
  created: string;
  episode: string[];
  gender: Gender | string;
  image: string;
  location: LocationSummary;
  name: string;
  origin: LocationSummary;
  species: string;
  status: Status | string;
  type: string;
  url: string;
}





