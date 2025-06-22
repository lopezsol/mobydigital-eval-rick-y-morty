import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CharacterMapper } from '../mappers/character.mapper';
import { PaginationInfoMapper } from '../mappers/pagination-info.mapper';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Character } from '@characters/interfaces/character.interface';
import type {
  RestCharacter,
  RestPaginatedCharacters,
} from '../interfaces/rest-paginated-characters.interface';

const apiUrl = environment.CHARACTER_API_URL;
@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private http = inject(HttpClient);

  getAllCharacters(page: number) {
    const url = `${apiUrl}/character?page=${page}`;

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

  getCharacterById(id: number) {
    const url = `${apiUrl}/character/${id}`;
    return this.http.get<RestCharacter>(url).pipe(
      map((resp) => CharacterMapper.mapRestCharacterToCharacter(resp)),
      catchError((error) => {
        console.error('Error fetching characters:', error);
        return throwError(
          () => new Error(`No se pudo obtener el personaje con id: ${id}`)
        );
      })
    );
  }

  getCharacterByUrl(url: string): Observable<Character> {
    return this.http.get<RestCharacter>(url).pipe(
      map((resp) => CharacterMapper.mapRestCharacterToCharacter(resp)),
      catchError((error) => {
        console.error('Error fetching characters:', error);
        return throwError(
          () => new Error(`No se pudo obtener el personaje con url: ${url}`)
        );
      })
    );
  }

  getAllCharactersByName(name: string, page: number) {
    const url = `${apiUrl}/character?page=${page}&name=${name}`;

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
        return throwError(
          () => new Error(`No se pudo obtener personajes con nombre ${name}`)
        );
      })
    );
  }
}
