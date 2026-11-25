import { Confirmservice } from '../../confirmdialog/confirmdialog'
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BusinessDTO } from '../../../models/BusinessDTO';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-businesslistcomponent',
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './businesslistcomponent.html',
  styleUrl: './businesslistcomponent.css',
})
export class Businesslistcomponent implements OnInit {

  // Empresas: solo el ADMIN registra, edita y elimina (HU61 "Como administrador")
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  displayedColumns: string[] = ['C2', 'C3', 'C4', 'C5', 'C6']
  dataSource: BusinessDTO[] = []
  cargando: boolean = true
  terminoBusqueda: string = ''
  // Paginacion: 5 registros por pagina
  readonly tamPagina: number = 5
  pagina: number = 0
  mensaje: string = ''

  constructor(
    private loginS: Loginservice,
    private s: Businessservice,
    private cdr: ChangeDetectorRef,
    private confirmS: Confirmservice
  ) { }

  ngOnInit(): void {
    this.obtenerEmpresas()
  }

  obtenerEmpresas(): void {
    this.s.getBusinesses().subscribe({
      next: data => {
        this.cargando = false
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        this.cargando = false
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

  get filasFiltradas(): BusinessDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    if (!termino) {
      return this.dataSource
    }

    return this.dataSource.filter(empresa =>
      [
        empresa.idBusinessEntity,
        empresa.name,
        empresa.type,
        empresa.companyName,
        empresa.active ? 'sí' : 'no'
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))
    )
  }

  eliminarEmpresa(id: number): void {
    this.confirmS.preguntar(`¿Seguro que deseas eliminar la empresa #${id}? Esta acción no se puede deshacer.`).subscribe(ok => {
      if (!ok) {
        return
      }

      this.s.deleteBusiness(id).subscribe({
        next: () => {
          this.mensaje = ''
          this.obtenerEmpresas()
          this.cdr.detectChanges()
        }, error: err => {
          this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
          this.cdr.detectChanges()
        }
      })
    })
  }
}
