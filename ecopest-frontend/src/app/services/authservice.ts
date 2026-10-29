import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequestDTO, LoginResponseDTO } from '../models/LoginDTO';
import { MeDTO } from '../models/MeDTO';

const TOKEN_KEY = 'ecopest.token';

@Injectable({ providedIn: 'root' })
export class Authservice {
  private token = signal<string | null>(this.readToken());
  readonly me = signal<MeDTO | null>(null);

  /** Roles del claim "roles" del JWT, ej. ["ROLE_ADMIN"] */
  readonly roles = computed<string[]>(() => {
    const t = this.token();
    if (!t) return [];
    try {
      const payload = JSON.parse(this.decodeBase64Url(t.split('.')[1]));
      return String(payload.roles ?? '')
        .split(',')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
    } catch {
      return [];
    }
  });

  readonly isLoggedIn = computed(() => this.token() !== null && !this.isExpired());
  readonly isAdmin = computed(() => this.roles().includes('ROLE_ADMIN'));
  /** ADMIN y SUPERVISOR pueden crear y editar (POST/PUT) */
  readonly canWrite = computed(() => this.isAdmin() || this.roles().includes('ROLE_SUPERVISOR'));
  /** Solo ADMIN puede eliminar */
  readonly canDelete = computed(() => this.isAdmin());
  readonly roleLabel = computed(() => (this.roles()[0] ?? '').replace('ROLE_', ''));

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Se llama al arrancar la app (provideAppInitializer). Si hay sesion guardada, recarga los datos del usuario.
   * No va en el constructor porque el interceptor inyecta este servicio (dependencia circular).
   */
  init(): void {
    if (this.isLoggedIn()) {
      this.loadMe().subscribe({ error: () => {} });
    } else if (this.token()) {
      this.clear();
    }
  }

  getToken(): string | null {
    return this.isLoggedIn() ? this.token() : null;
  }

  login(request: LoginRequestDTO): Observable<MeDTO> {
    return this.http.post<LoginResponseDTO>(`${environment.base}/login`, request).pipe(
      tap((res) => {
        this.token.set(res.token);
        try {
          localStorage.setItem(TOKEN_KEY, res.token);
        } catch {
          /* ignorar */
        }
      }),
      switchMap(() => this.loadMe()),
    );
  }

  loadMe(): Observable<MeDTO> {
    return this.http
      .get<MeDTO>(`${environment.base}/api/me`)
      .pipe(tap((me) => this.me.set(me)));
  }

  logout(): void {
    this.clear();
    this.router.navigate(['/login']);
  }

  private clear(): void {
    this.token.set(null);
    this.me.set(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignorar */
    }
  }

  private isExpired(): boolean {
    const t = this.token();
    if (!t) return true;
    try {
      const payload = JSON.parse(this.decodeBase64Url(t.split('.')[1]));
      return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private readToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private decodeBase64Url(part: string): string {
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    return decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
  }
}
