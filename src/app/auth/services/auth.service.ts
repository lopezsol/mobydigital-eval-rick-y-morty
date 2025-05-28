import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { User } from '@auth/interfaces/user.interface';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthErrorResponse } from '@auth/interfaces/auth-error-response.interface';
import { SessionStorageKey } from '@auth/enums/session-storage-key.enum';
import { AuthStatus } from '@auth/enums/auth-status.enum';

// type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';s
const baseUrl = environment.AUTH_API_URL;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authStatus = signal<AuthStatus>(AuthStatus.Checking);
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(
    sessionStorage.getItem(SessionStorageKey.Token)
  );

  private http = inject(HttpClient);

  $authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === AuthStatus.Checking) return AuthStatus.Checking;
    if (this._user()) return AuthStatus.Authenticated;
    return AuthStatus.NotAuthenticated;
  });

  user = computed(() => this._user());
  token = computed(this._token);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });
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
    // this._authStatus.set('not-authenticated');
    this._authStatus.set(AuthStatus.NotAuthenticated);


    sessionStorage.removeItem(SessionStorageKey.User);
    sessionStorage.removeItem(SessionStorageKey.Token);
  }

  private handleAuthSuccess(user: User, token: string) {
    this._user.set(user);
    // this._authStatus.set('authenticated');
    this._authStatus.set(AuthStatus.Authenticated);

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
