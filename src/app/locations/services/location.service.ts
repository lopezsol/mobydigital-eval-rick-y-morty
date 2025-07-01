import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestLocation } from '../interfaces/rest-location.interface';
import { LocationMapper } from '../mappers/location.mapper';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

const apiUrl = environment.CHARACTER_API_URL;
@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);

  getLocationById(id: number) {
    const url = `${apiUrl}/location/${id}`;
    return this.http.get<RestLocation>(url).pipe(
      map((resp) => LocationMapper.mapRestLocationToLocation(resp)),
      catchError((error) => {
        console.error('Error fetching locations:', error);
        return throwError(
          () => new Error(`We couldn't load the location details.`)
        );
      })
    );
  }

  getLocationByUrl(url: string) {
    return this.http.get<RestLocation>(url).pipe(
      map((resp) => LocationMapper.mapRestLocationToLocation(resp)),
      catchError((error) => {
        console.error('Error fetching locations:', error);
        return throwError(
          () => new Error(`We couldn't load the location details.`)
        );
      })
    );
  }
}
