import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InspectionDTO } from '../../../models/InspectionDTO';
import { Inspectionservice } from '../../../services/inspectionservice';
import { Businessservice } from '../../../services/businessservice';
import { Userservice } from '../../../services/userservice';

@Component({
  selector: 'app-inspectionlistcomponent',
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './inspectionlistcomponent.html',
  styleUrl: './inspectionlistcomponent.css',
})
export class Inspectionlistcomponent implements OnInit {

  // ADMIN y SUPERVISOR pueden registrar y editar; solo ADMIN elimina
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  // Tester y Cliente solo leen: no ven la columna ID ni la de Acciones (quedaria vacia)
  get displayedColumns(): string[] {
    if (this.puedeEscribir()) {
      return ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7']
    }
    return ['C2', 'C3', 'C4', 'C5', 'C6']
  }
  dataSource: InspectionDTO[] = []
  terminoBusqueda: string = ''
  // Paginacion: 5 registros por pagina
  readonly tamPagina: number = 5
  pagina: number = 0
  mensaje: string = ''
  empresas: any[] = []
  usuarios: any[] = []

  constructor(
    private loginS: Loginservice,
    private s: Inspectionservice,
    private cdr: ChangeDetectorRef,
    private businessS: Businessservice,
    private userS: Userservice
  ) { }

  ngOnInit(): void {
    this.obtenerInspecciones()
    this.businessS.getBusinesses().subscribe({
      next: data => {
        this.empresas = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
    this.userS.getUsers().subscribe({
      next: data => {
        this.usuarios = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  obtenerInspecciones(): void {
    this.s.getInspections().subscribe({
      next: data => {
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.cdr.detectChanges()
      }
    })
  }

  eliminarInspeccion(id: number): void {
    if (!window.confirm(`¿Seguro que deseas eliminar la inspección #${id}? Esta acción no se puede deshacer.`)) {
      return
    }

    this.s.deleteInspection(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerInspecciones()
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
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

  get filasFiltradas(): InspectionDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    if (!termino) {
      return this.dataSource
    }

    return this.dataSource.filter(inspeccion =>
      [
        inspeccion.idInspection,
        inspeccion.inspectionDate,
        inspeccion.status,
        inspeccion.observations,
        this.nombreEmpresa(inspeccion.businessEntityId),
        this.nombreUsuario(inspeccion.userId)
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))
    )
  }

  nombreEmpresa(id: number | null): string {
    const x = this.empresas.find(item => item.idBusinessEntity === id)
    return x ? x.name : ''
  }

  nombreUsuario(id: number | null): string {
    const x = this.usuarios.find(item => item.idUser === id)
    return x ? x.name : ''
  }
}
