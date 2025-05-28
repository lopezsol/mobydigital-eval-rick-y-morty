import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '@auth/interfaces/user.interface';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthErrorResponse } from '@auth/interfaces/auth-error-response.interface';
import { SessionStorageKey } from '@auth/enums/session-storage-key.enum';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.AUTH_API_URL;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(
    sessionStorage.getItem(SessionStorageKey.Token)
  );

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

  register(user: User): Observable<AuthResponse | AuthErrorResponse> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/user/register`, {
        name: user.name,
        mail: user.mail,
        password: user.password,
        address: user.address,
      })
      .pipe(
        catchError((error: any) => {
          const message =
            error?.error?.header?.error ?? 'Error desconocido al registrarse';
          console.log('message en service; ', message);
          return throwError(() => new Error(message));
        })
      );
  }

  checkStatus(): Observable<boolean> {
    const token = sessionStorage.getItem(SessionStorageKey.Token);
    const storedUser = sessionStorage.getItem(SessionStorageKey.User);

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

    sessionStorage.removeItem(SessionStorageKey.User);
    sessionStorage.removeItem(SessionStorageKey.Token);
  }

  private handleAuthSuccess(user: User, token: string) {
    this._user.set(user);
    this._authStatus.set('authenticated');
    this._token.set(token);

    sessionStorage.setItem(SessionStorageKey.User, JSON.stringify(user));
    sessionStorage.setItem(SessionStorageKey.Token, token);
    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    console.log(error);
    return of(false);
  }
}
