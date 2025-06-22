import { RestPaginationInfo } from './../../characters/interfaces/rest-paginated-characters.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { EpisodeMapper } from '../mappers/episode.mapper';
import { environment } from '../../../environments/environment';
import { PaginationInfoMapper } from '@characters/mappers/pagination-info.mapper';
import type { Episode } from '@episodes/interfaces/episode.interface';
import type { EpisodeResponse } from '@episodes/interfaces/episode-response.interface';
import type { EpisodesResponse } from '@episodes/interfaces/episodes-response.interface';

const apiUrl = environment.CHARACTER_API_URL;
@Injectable({
  providedIn: 'root',
})
export class EpisodeService {
  private http = inject(HttpClient);

  getEpisodeById(id: number): Observable<Episode> {
    const url = `${apiUrl}/episode/${id}`;
    return this.http.get<EpisodeResponse>(url).pipe(
      map((resp) => EpisodeMapper.mapEpisodeResponseToEpisode(resp)),
      catchError((error) => {
        console.error('Error fetching episodes:', error);
        return throwError(
          () => new Error(`No se pudo obtener el episodio con id: ${id}`)
        );
      })
    );
  }

  getEpisodeByUrl(url: string): Observable<Episode> {
    return this.http.get<EpisodeResponse>(url).pipe(
      map((resp) => EpisodeMapper.mapEpisodeResponseToEpisode(resp)),
      catchError((error) => {
        console.error('Error fetching episodes:', error);
        return throwError(
          () => new Error(`No se pudo obtener el episodio con url: ${url}`)
        );
      })
    );
  }

  getAllEpisodes(
    page: number
  ): Observable<{ episodes: Episode[]; info: RestPaginationInfo }> {
    const url = `${apiUrl}/episode?page=${page}`;

    return this.http.get<EpisodesResponse>(url).pipe(
      map((resp) => ({
        episodes: EpisodeMapper.mapEpisodesResponseToEpisodesArray(
          resp.results
        ),
        info: PaginationInfoMapper.mapRestPaginationInfoToPaginationInfo(
          resp.info
        ),
      })),
      catchError((error) => {
        console.error('Error fetching episodes:', error);
        return throwError(() => new Error('No se pudieron obtener los episodios'));
      })
    );
  }

  getAllEpisodesByName(
    name: string,
    page: number
  ): Observable<{ episodes: Episode[]; info: RestPaginationInfo }> {
    const url = `${apiUrl}/episode?page=${page}&name=${name}`;

    return this.http.get<EpisodesResponse>(url).pipe(
      map((resp) => ({
        episodes: EpisodeMapper.mapEpisodesResponseToEpisodesArray(
          resp.results
        ),
        info: PaginationInfoMapper.mapRestPaginationInfoToPaginationInfo(
          resp.info
        ),
      })),
      catchError((error) => {
        console.error('Error fetching episodes:', error);
        return throwError(() => new Error('No se pudieron obtener los episodios'));
      })
    );
  }
}
