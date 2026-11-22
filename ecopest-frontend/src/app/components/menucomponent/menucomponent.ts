import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-menucomponent',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    RouterLink],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent {
  constructor(private loginS: Loginservice) {}

  // ADMIN y SUPERVISOR pueden registrar y editar
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  // Solo ADMIN ve Usuarios y Roles
  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  usuario(): string {
    return this.loginS.showUser();
  }

  cerrarSesion(): void {
    this.loginS.logout();
  }
}
