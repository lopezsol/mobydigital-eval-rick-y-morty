import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestLocation } from '../interfaces/rest-location.interface';
import { LocationMapper } from '../mappers/location.mapper';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getLocationById(id: number) {
    const url = `${this.apiUrl}/location/${id}`;
    return this.http.get<RestLocation>(url).pipe(
      map((resp) => LocationMapper.mapRestLocationToLocation(resp)),
      catchError((error) => {
        console.error('Error fetching locations:', error);
        return throwError(
          () => new Error(`No se pudo obtener la ubicación con id: ${id}`)
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
          () => new Error(`No se pudo obtener la ubicación con url: ${url}`)
        );
      })
    );
  }
}
