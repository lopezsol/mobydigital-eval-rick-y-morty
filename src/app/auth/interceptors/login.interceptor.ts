import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ErrorService } from '@shared/services/error.service';
import { catchError, throwError } from 'rxjs';

export const loginInterceptor: HttpInterceptorFn = (
  req,
  next: HttpHandlerFn
) => {
  const errorService = inject(ErrorService);

  const isLoginRequest =
    req.url.includes('/user/login') && req.method === 'POST';

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (isLoginRequest) {
        errorService.showError('Please check your credentials and try again.');
      }

      return throwError(() => error);
    })
  );
};
