import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { Loginservice } from '../services/loginservice';

// Se ejecuta en CADA peticion HTTP: le pega el token en la cabecera Authorization
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginS = inject(Loginservice);
  const snack = inject(MatSnackBar);
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
      // 403 = el rol no tiene permiso para esa accion
      if (err.status === 403) {
        snack.open('No tienes permiso para realizar esta acción', 'Cerrar', { duration: 4000 });
      }
      return throwError(() => err);
    })
  );
};
