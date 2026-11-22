import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequestDTO } from '../models/LoginRequestDTO';
import { LoginResponseDTO } from '../models/LoginResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class Loginservice {
  private apiURL = `${environment.base}/login`;

  constructor(private http: HttpClient, private router: Router) {}

  // POST /login: manda usuario y clave, y guarda el token que devuelve el back
  login(request: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(this.apiURL, request).pipe(
      tap((resp) => {
        sessionStorage.setItem('token', resp.token);
        sessionStorage.setItem('username', resp.username);
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  // true si hay token y todavia no vencio (dura 5 horas)
  verificar(): boolean {
    const payload = this.leerToken();
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  }

  // Rol del usuario, sacado del claim "roles" del token (ej: "ROLE_ADMIN")
  showRole(): string {
    const payload = this.leerToken();
    return payload?.roles ?? '';
  }

  // Correo del usuario (claim "sub" del token)
  showUser(): string {
    return sessionStorage.getItem('username') ?? '';
  }

  tieneRol(...roles: string[]): boolean {
    const mio = this.showRole().split(',');
    return roles.some((r) => mio.includes(r));
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  // El JWT tiene 3 partes separadas por "."; la del medio (payload) es JSON en base64
  private leerToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }
}
