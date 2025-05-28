import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '@auth/interfaces/user.interface';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { rxResource } from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.AUTH_API_URL;

//TODO: agregar enum para session storage
@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(sessionStorage.getItem('token'));

  private http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(this._token);

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/user/login`, {
        mail: email,
        password: password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp.data.user, resp.data.token)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  register(user: User): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/user/register`, {
        name: user.name,
        mail: user.mail,
        password: user.password,
        address: user.address,
      })
      .pipe(
        map((resp) => true),
        catchError((error: any) => {
          const message =
            error?.error?.header?.error ?? 'Error desconocido al registrarse';
          return throwError(() => new Error(message));
        })
      );
  }

  checkStatus(): Observable<boolean> {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');

    if (!token || !storedUser) {
      this.logout();
      return of(false);
    }

    this.handleAuthSuccess(JSON.parse(storedUser), token);
    return of(true);
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }

  private handleAuthSuccess(user: User, token: string) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);

    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    console.log(error);
    return of(false);
  }
}
