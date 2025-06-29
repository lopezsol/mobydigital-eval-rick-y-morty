import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '@auth/services/auth.service';
import type { UpdateUserResponse } from '@user/interfaces/update-user-response.interface';
import type { UpdateUserDto } from '@user/interfaces/update-user-dto.interface';

const apiUrl = environment.AUTH_API_URL;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private _token = this.authService.token() || '';

  update(user: UpdateUserDto): Observable<UpdateUserResponse> {
    console.log('token: ', this._token);

    const headers = new HttpHeaders({
      'auth-token': this._token,
    });

    //TODO: revisar que version es mejor
    // const token = this.authService.token();

    // const headers = new HttpHeaders({
    //   'auth-token': token ?? '',
    // });
    return this.http
      .put<UpdateUserResponse>(
        `${apiUrl}/user/update`,
        { ...user },
        { headers }
      )
      .pipe(
        catchError((error: any) => {
          const message =
            error?.error?.header?.error ??
            'Error desconocido al actualizar los datos del usuario';
          console.error(error);
          return throwError(() => new Error(message));
        })
      );
  }
}
