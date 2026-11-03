import { HttpErrorResponse } from '@angular/common/http';

/** Extrae el mensaje del ErrorResponse del backend ({status, message, path}). */
export function errorMessage(err: unknown, fallback: string): string {
  const e = err as HttpErrorResponse;
  if (e?.status === 0) return fallback;
  const body = e?.error;
  if (body && typeof body === 'object') {
    if (typeof body.message === 'string' && body.message.length > 0) return body.message;
    if (body.errors && typeof body.errors === 'object') {
      return Object.values(body.errors).join('. ');
    }
  }
  return fallback;
}
