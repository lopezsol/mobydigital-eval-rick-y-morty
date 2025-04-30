import { Location } from '../interfaces/location.interface';
import { RestLocation } from '../interfaces/rest-location.interface';

export class LocationMapper {
  static mapRestLocationToLocation(restLocation: RestLocation): Location {
    return {
      id: restLocation.id,
      name: restLocation.name,
      url: restLocation.url,
    };
  }
}
