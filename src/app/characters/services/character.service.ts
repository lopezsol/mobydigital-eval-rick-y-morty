import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestPaginatedCharacters } from '../interfaces/paginated-characters.interface';
import { CharacterMapper } from '../mappers/character.mapper';
import { PaginationInfoMapper } from '../mappers/pagination-info.mapper';
import { catchError, delay, map, throwError } from 'rxjs';

const API_URL = 'https://rickandmortyapi.com/api';
@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private http = inject(HttpClient);

  getAllCharacters(page: number) {
    const url = `${API_URL}/character/?page=${page}`;

    return this.http.get<RestPaginatedCharacters>(url).pipe(
      map((resp) => ({
        characters: CharacterMapper.mapRestCharactersToCharacterArray(
          resp.results
        ),
        info: PaginationInfoMapper.mapRestPaginationInfoToPaginationInfo(
          resp.info
        ),
      })),
      catchError((error) => {
        console.error('Error fetching characters:', error);
        return throwError(() => new Error('No se pudo obtener los personajes'));
      })
    );
  }
}
