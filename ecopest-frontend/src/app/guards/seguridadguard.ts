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
  return router.createUrlTree(['/login']);
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
