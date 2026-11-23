import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IncidentDTO } from '../../../models/IncidentDTO';
import { Incidentservice } from '../../../services/incidentservice';
import { Inspectionservice } from '../../../services/inspectionservice';
import { Pestservice } from '../../../services/pestservice';
import { Recommendationservice } from '../../../services/recommendationservice';

@Component({
  selector: 'app-incidentlistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './incidentlistcomponent.html',
  styleUrl: './incidentlistcomponent.css',
})
export class Incidentlistcomponent implements OnInit {

  // ADMIN y SUPERVISOR pueden registrar y editar; solo ADMIN elimina
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7']
  dataSource: IncidentDTO[] = []
  terminoBusqueda: string = ''
  generando: boolean = false
  mensaje: string = ''
  inspecciones: any[] = []
  plagas: any[] = []

  constructor(
    private loginS: Loginservice,
    private s: Incidentservice,
    private cdr: ChangeDetectorRef,
    private inspectionS: Inspectionservice,
    private pestS: Pestservice,
    private recommendationS: Recommendationservice
  ) { }

  ngOnInit(): void {
    this.obtenerIncidentes()
    this.inspectionS.getInspections().subscribe({
      next: data => {
        this.inspecciones = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
    this.pestS.getPests().subscribe({
      next: data => {
        this.plagas = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  obtenerIncidentes(): void {
    this.s.getIncidents().subscribe({
      next: data => {
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.cdr.detectChanges()
      }
    })
  }

  eliminarIncidente(id: number): void {
    if (!window.confirm(`¿Seguro que deseas eliminar el incidente #${id}? Esta acción no se puede deshacer.`)) {
      return
    }

    this.s.deleteIncident(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerIncidentes()
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
    }
  }

  get filasFiltradas(): IncidentDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    if (!termino) {
      return this.dataSource
    }

    return this.dataSource.filter(incidente =>
      [
        incidente.idIncident,
        incidente.incidentDate,
        incidente.description,
        incidente.status,
        this.nombreInspeccion(incidente.inspectionId),
        this.nombrePlaga(incidente.pestTypeId)
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))
    )
  }

  // Pide a la IA (Gemini) una recomendación para el incidente; el backend la guarda con origen IA
  generarRecomendacion(id: number): void {
    if (this.generando) {
      return
    }
    this.generando = true
    this.mensaje = 'Generando recomendación con IA...'
    this.recommendationS.generateWithAI(id).subscribe({
      next: () => {
        this.generando = false
        this.mensaje = 'Recomendación generada con IA para el incidente #' + id + '. Puede verla en Recomendaciones.'
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.generando = false
        if (err.status == 429) {
          this.mensaje = 'Se alcanzó el límite de uso de la IA (es gratuita y tiene tope). Intente de nuevo en un minuto o mañana.'
        } else {
          this.mensaje = 'No se pudo generar la recomendación con IA. Intente nuevamente en unos segundos.'
        }
        this.cdr.detectChanges()
      }
    })
  }

  nombreInspeccion(id: number | null): string {
    const x = this.inspecciones.find(item => item.idInspection === id)
    return x ? '#' + x.idInspection + ' - ' + x.inspectionDate : ''
  }

  nombrePlaga(id: number | null): string {
    const x = this.plagas.find(item => item.idPestType === id)
    return x ? x.name : ''
  }
}
