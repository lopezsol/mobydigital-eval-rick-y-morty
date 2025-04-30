import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { RestEpisode } from '../interfaces/rest-episode.interface';
import { EpisodeMapper } from '../mappers/episode.mapper';
const API_URL = 'https://rickandmortyapi.com/api';

@Injectable({
  providedIn: 'root',
})
export class EpisodeService {
  private http = inject(HttpClient);

  getEpisodeById(id: number) {
    const url = `${API_URL}/episode/${id}`;
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
