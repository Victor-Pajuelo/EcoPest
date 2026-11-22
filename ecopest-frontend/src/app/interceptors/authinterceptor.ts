import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Loginservice } from '../services/loginservice';

// Se ejecuta en CADA peticion HTTP: le pega el token en la cabecera Authorization
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginS = inject(Loginservice);
  const token = loginS.getToken();

  if (token && !req.url.endsWith('/login')) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // 401 = token vencido o invalido: cerramos sesion y vamos al login
      if (err.status === 401 && !req.url.endsWith('/login')) {
        loginS.logout();
      }
      return throwError(() => err);
    })
  );
};
