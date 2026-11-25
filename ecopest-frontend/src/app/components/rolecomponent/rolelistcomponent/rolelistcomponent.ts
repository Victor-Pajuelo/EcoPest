import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RoleDTO } from '../../../models/RoleDTO';
import { Roleservice } from '../../../services/roleservice';

@Component({
  selector: 'app-rolelistcomponent',
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './rolelistcomponent.html',
  styleUrl: './rolelistcomponent.css',
})
export class Rolelistcomponent implements OnInit {

  // ADMIN y SUPERVISOR pueden registrar y editar; solo ADMIN elimina
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4', 'C5']
  dataSource: RoleDTO[] = []
  terminoBusqueda: string = ''
  // Paginacion: 5 registros por pagina
  readonly tamPagina: number = 5
  pagina: number = 0
  mensaje: string = ''

  constructor(
    private loginS: Loginservice,
    private s: Roleservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerRoles()
  }

  obtenerRoles(): void {
    this.s.getRoles().subscribe({
      next: data => {
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.cdr.detectChanges()
      }
    })
  }

  actualizarBusqueda(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.terminoBusqueda = event.target.value
      this.pagina = 0
    }
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = ''
    this.pagina = 0
  }

  // Si se borra o filtra y la pagina queda vacia, se muestra la ultima pagina con datos
  get paginaActual(): number {
    const ultima = Math.max(0, Math.ceil(this.filasFiltradas.length / this.tamPagina) - 1)
    return Math.min(this.pagina, ultima)
  }

  get filasPagina() {
    const inicio = this.paginaActual * this.tamPagina
    return this.filasFiltradas.slice(inicio, inicio + this.tamPagina)
  }

  cambiarPagina(event: PageEvent): void {
    this.pagina = event.pageIndex
  }

  get filasFiltradas(): RoleDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    if (!termino) {
      return this.dataSource
    }

    return this.dataSource.filter(rol =>
      [
        rol.idRole,
        rol.name,
        rol.description,
        rol.active ? 'sí' : 'no'
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))
    )
  }

  eliminarRol(id: number): void {
    if (!window.confirm(`¿Seguro que deseas eliminar el rol #${id}? Esta acción no se puede deshacer.`)) {
      return
    }

    this.s.deleteRole(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerRoles()
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
        this.cdr.detectChanges()
      }
    })
  }
}
