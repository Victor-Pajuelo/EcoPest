import { Confirmservice } from '../../confirmdialog/confirmdialog'
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RecommendationDTO } from '../../../models/RecommendationDTO';
import { Recommendationservice } from '../../../services/recommendationservice';
import { Incidentservice } from '../../../services/incidentservice';
import { Userservice } from '../../../services/userservice';

@Component({
  selector: 'app-recommendationlistcomponent',
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './recommendationlistcomponent.html',
  styleUrl: './recommendationlistcomponent.css',
})
export class Recommendationlistcomponent implements OnInit {

  // ADMIN y SUPERVISOR pueden registrar y editar; solo ADMIN elimina
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  displayedColumns: string[] = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7']
  dataSource: RecommendationDTO[] = []
  cargando: boolean = true
  terminoBusqueda: string = ''
  // Paginacion: 5 registros por pagina
  readonly tamPagina: number = 5
  pagina: number = 0
  mensaje: string = ''
  incidentes: any[] = []
  usuarios: any[] = []

  constructor(
    private loginS: Loginservice,
    private s: Recommendationservice,
    private cdr: ChangeDetectorRef,
    private confirmS: Confirmservice,
    private incidentS: Incidentservice,
    private userS: Userservice
  ) { }

  ngOnInit(): void {
    this.obtenerRecomendaciones()
    this.incidentS.getIncidents().subscribe({
      next: data => {
        this.incidentes = data
        this.cdr.detectChanges()
      }, error: err => {
      }
    })
    this.userS.getUsers().subscribe({
      next: data => {
        this.usuarios = data
        this.cdr.detectChanges()
      }, error: err => {
      }
    })
  }

  obtenerRecomendaciones(): void {
    this.s.getRecommendations().subscribe({
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

  get filasFiltradas(): RecommendationDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    if (!termino) {
      return this.dataSource
    }

    return this.dataSource.filter(recomendacion =>
      [
        recomendacion.idRecommendation,
        recomendacion.description,
        recomendacion.origin,
        recomendacion.status,
        recomendacion.generationDate,
        this.nombreIncidente(recomendacion.incidentId),
        this.nombreUsuario(recomendacion.responsibleUserId)
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))
    )
  }

  eliminarRecomendacion(id: number): void {
    this.confirmS.preguntar(`¿Seguro que deseas eliminar la recomendación #${id}? Esta acción no se puede deshacer.`).subscribe(ok => {
      if (!ok) {
        return
      }

      this.s.deleteRecommendation(id).subscribe({
        next: () => {
          this.mensaje = ''
          this.obtenerRecomendaciones()
          this.cdr.detectChanges()
        }, error: err => {
          this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
          this.cdr.detectChanges()
        }
      })
    })
  }

  nombreIncidente(id: number | null): string {
    const x = this.incidentes.find(item => item.idIncident === id)
    return x ? '#' + x.idIncident + ' - ' + x.description : ''
  }

  nombreUsuario(id: number | null): string {
    const x = this.usuarios.find(item => item.idUser === id)
    return x ? x.name : ''
  }
}
