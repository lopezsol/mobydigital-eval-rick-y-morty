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

  update(user: UpdateUserDto): Observable<UpdateUserResponse> {
    const token = this.authService.token();

    const headers = new HttpHeaders({
      'auth-token': token ?? '',
    });

    console.log(user);
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
            'Something went wrong while updating your profile. Please try again.';
          console.error(error);
          return throwError(() => new Error(message));
        })
      );
  }

  updateFavoriteEpisodes(user: UpdateUserDto) {
    const token = this.authService.token();

    const headers = new HttpHeaders({
      'auth-token': token ?? '',
    });

    console.log(user);
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
            'Something went wrong while updating your profile. Please try again.';
          console.error(error);
          return throwError(() => new Error(message));
        })
      );
  }
}
