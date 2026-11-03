import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Authservice } from '../services/authservice';

/** Agrega el JWT a cada llamada al backend y cierra la sesion si el token vence (401). */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Authservice);
  if (!req.url.startsWith(environment.base)) {
    return next(req);
  }
  const token = auth.getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.endsWith('/login')) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
