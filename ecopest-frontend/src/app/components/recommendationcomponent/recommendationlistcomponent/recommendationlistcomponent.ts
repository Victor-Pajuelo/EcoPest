import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RecommendationDTO } from '../../../models/RecommendationDTO';
import { Recommendationservice } from '../../../services/recommendationservice';
import { Incidentservice } from '../../../services/incidentservice';
import { Userservice } from '../../../services/userservice';

@Component({
  selector: 'app-recommendationlistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
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

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7']
  dataSource: RecommendationDTO[] = []
  terminoBusqueda: string = ''
  mensaje: string = ''
  incidentes: any[] = []
  usuarios: any[] = []

  constructor(
    private loginS: Loginservice,
    private s: Recommendationservice,
    private cdr: ChangeDetectorRef,
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

  obtenerRecomendaciones(): void {
    this.s.getRecommendations().subscribe({
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
    }
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = ''
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
    if (!window.confirm(`¿Seguro que deseas eliminar la recomendación #${id}? Esta acción no se puede deshacer.`)) {
      return
    }

    this.s.deleteRecommendation(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerRecomendaciones()
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
        this.cdr.detectChanges()
      }
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
