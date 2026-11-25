import { Confirmservice } from '../../confirmdialog/confirmdialog'
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { PestTypeDTO } from '../../../models/PestTypeDTO';
import { Pestservice } from '../../../services/pestservice';

@Component({
  selector: 'app-pestlistcomponent',
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink, FormsModule],
  templateUrl: './pestlistcomponent.html',
  styleUrl: './pestlistcomponent.css',
})
export class Pestlistcomponent implements OnInit {

  // ADMIN y SUPERVISOR pueden registrar y editar; solo ADMIN elimina
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  displayedColumns: string[] = ['C2', 'C3', 'C4', 'C5']
  dataSource: PestTypeDTO[] = []
  cargando: boolean = true
  terminoBusqueda: string = ''
  // Paginacion: 5 registros por pagina
  readonly tamPagina: number = 5
  pagina: number = 0
  filtroRiesgo: string = ''
  mensaje: string = ''

  constructor(
    private loginS: Loginservice,
    private s: Pestservice,
    private cdr: ChangeDetectorRef,
    private confirmS: Confirmservice
  ) { }

  ngOnInit(): void {
    this.obtenerPlagas()
  }

  obtenerPlagas(): void {
    this.s.getPests().subscribe({
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

  get filasFiltradas(): PestTypeDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    return this.dataSource.filter(plaga => {
      const coincideRiesgo = !this.filtroRiesgo ||
        String(plaga.riskLevel ?? '').toLocaleLowerCase() === this.filtroRiesgo.toLocaleLowerCase()

      const coincideTexto = !termino || [
        plaga.idPestType,
        plaga.name,
        plaga.riskLevel,
        plaga.description
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))

      return coincideRiesgo && coincideTexto
    })
  }

  eliminarPlaga(id: number): void {
    this.confirmS.preguntar(`¿Seguro que deseas eliminar la plaga #${id}? Esta acción no se puede deshacer.`).subscribe(ok => {
      if (!ok) {
        return
      }

      this.s.deletePest(id).subscribe({
        next: () => {
          this.mensaje = ''
          this.obtenerPlagas()
          this.cdr.detectChanges()
        }, error: err => {
          this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
          this.cdr.detectChanges()
        }
      })
    })
  }
}
