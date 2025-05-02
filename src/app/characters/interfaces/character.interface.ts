import type { Location } from "../../locations/interfaces/location.interface";
import type { Gender } from "./rest-paginated-characters.interface";
import { Status } from "./status.interface";

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





