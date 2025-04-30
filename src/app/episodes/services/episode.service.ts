import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { RestEpisode } from '../interfaces/rest-episode.interface';
import { EpisodeMapper } from '../mappers/episode.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EpisodeService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getEpisodeById(id: number) {
    const url = `${this.apiUrl}/episode/${id}`;
    return this.http.get<RestEpisode>(url).pipe(
      map((resp) => EpisodeMapper.mapRestEpisodeToEpisode(resp)),
      catchError((error) => {
        console.error('Error fetching episodes:', error);
        return throwError(
          () => new Error(`No se pudo obtener el episodio con id: ${id}`)
        );
      })
    );
  }

  getEpisodeByUrl(url: string) {
    return this.http.get<RestEpisode>(url).pipe(
      map((resp) => EpisodeMapper.mapRestEpisodeToEpisode(resp)),
      catchError((error) => {
        console.error('Error fetching episodes:', error);
        return throwError(
          () => new Error(`No se pudo obtener el episodio con url: ${url}`)
        );
      })
    );
  }
}
