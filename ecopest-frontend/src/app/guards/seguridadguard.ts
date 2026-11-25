import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Loginservice } from '../services/loginservice';

// 1) Solo deja entrar si hay sesion (token valido)
export const seguridadGuard: CanActivateFn = () => {
  const loginS = inject(Loginservice);
  const router = inject(Router);
  if (loginS.verificar()) {
    return true;
  }
  // Tenia token pero ya vencio: avisamos en el login
  if (loginS.hayToken()) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    return router.createUrlTree(['/login'], { queryParams: { expirada: 1 } });
  }
  // Sin sesion: se muestra la landing page publica
  return router.createUrlTree(['/inicio']);
};

// 2) Solo deja entrar si el rol esta en data: { roles: [...] } de la ruta
export const rolGuard: CanActivateFn = (route) => {
  const loginS = inject(Loginservice);
  const router = inject(Router);
  const roles: string[] = route.data['roles'] ?? [];
  if (loginS.verificar() && loginS.tieneRol(...roles)) {
    return true;
  }
  return router.createUrlTree(['/']);
};
