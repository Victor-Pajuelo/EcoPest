import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '../services/authservice';

/** Solo deja pasar a usuarios con sesion iniciada. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(Authservice);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

/** Solo ADMIN (usuarios y roles). */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(Authservice);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  return auth.isAdmin() ? true : router.createUrlTree(['/']);
};

/** Pantallas de crear/editar: ADMIN y SUPERVISOR. */
export const writeGuard: CanActivateFn = () => {
  const auth = inject(Authservice);
  const router = inject(Router);
  if (!auth.isLoggedIn()) return router.createUrlTree(['/login']);
  return auth.canWrite() ? true : router.createUrlTree(['/']);
};
