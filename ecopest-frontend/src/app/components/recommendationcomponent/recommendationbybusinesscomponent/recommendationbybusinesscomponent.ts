import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { Loginservice } from '../../../services/loginservice';
import { Businessservice } from '../../../services/businessservice';
import { Inspectionservice } from '../../../services/inspectionservice';
import { Incidentservice } from '../../../services/incidentservice';
import { Pestservice } from '../../../services/pestservice';
import { Recommendationservice } from '../../../services/recommendationservice';
import { RecommendationDTO } from '../../../models/RecommendationDTO';

/** Recomendaciones agrupadas por empresa: empresa -> incidentes -> recomendaciones, con boton de IA en cada incidente. */
@Component({
  selector: 'app-recommendationbybusinesscomponent',
  imports: [DatePipe, RouterLink, MatIconModule, MatButtonModule, MatExpansionModule],
  templateUrl: './recommendationbybusinesscomponent.html',
  styleUrl: './recommendationbybusinesscomponent.css',
})
export class Recommendationbybusinesscomponent implements OnInit {

  empresas: any[] = []
  inspecciones: any[] = []
  incidentes: any[] = []
  plagas: any[] = []
  recomendaciones: RecommendationDTO[] = []
  cargando: boolean = true
  mensaje: string = ''
  // incidente que se esta generando y ultima recomendacion creada (para resaltarla)
  generandoId: number | null = null
  nuevaId: number | null = null

  constructor(
    private loginS: Loginservice,
    private businessS: Businessservice,
    private inspectionS: Inspectionservice,
    private incidentS: Incidentservice,
    private pestS: Pestservice,
    private recommendationS: Recommendationservice,
    private cdr: ChangeDetectorRef
  ) { }

  // ADMIN y SUPERVISOR pueden generar con IA (igual que el back)
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR')
  }

  ngOnInit(): void {
    forkJoin({
      empresas: this.businessS.getBusinesses(),
      inspecciones: this.inspectionS.getInspections(),
      incidentes: this.incidentS.getIncidents(),
      plagas: this.pestS.getPests(),
      recomendaciones: this.recommendationS.getRecommendations(),
    }).subscribe({
      next: datos => {
        this.empresas = datos.empresas
        this.inspecciones = datos.inspecciones
        this.incidentes = datos.incidentes
        this.plagas = datos.plagas
        this.recomendaciones = datos.recomendaciones
        this.cargando = false
        this.cdr.detectChanges()
      }, error: err => {
        this.cargando = false
        this.mensaje = 'No se pudieron cargar los datos. Intente nuevamente.'
        this.cdr.detectChanges()
      }
    })
  }

  // Incidentes de una empresa: el incidente apunta a una inspeccion y la inspeccion a la empresa
  incidentesDe(idEmpresa: number): any[] {
    const ids = this.inspecciones.filter(i => i.businessEntityId === idEmpresa).map(i => i.idInspection)
    return this.incidentes.filter(inc => ids.includes(inc.inspectionId))
  }

  recomendacionesDe(idIncidente: number): RecommendationDTO[] {
    return this.recomendaciones
      .filter(r => r.incidentId === idIncidente)
      .sort((a, b) => String(a.generationDate).localeCompare(String(b.generationDate)))
  }

  totalRecomendaciones(idEmpresa: number): number {
    return this.incidentesDe(idEmpresa).reduce((suma, inc) => suma + this.recomendacionesDe(inc.idIncident).length, 0)
  }

  nombrePlaga(id: number | null): string {
    return this.plagas.find(p => p.idPestType === id)?.name ?? 'Plaga'
  }

  generar(idIncidente: number): void {
    if (this.generandoId != null) return
    this.generandoId = idIncidente
    this.mensaje = 'Generando recomendación con IA…'
    this.recommendationS.generateWithAI(idIncidente).subscribe({
      next: nueva => {
        // La nueva recomendacion aparece abajo, dentro del mismo incidente y resaltada
        this.recomendaciones = [...this.recomendaciones, nueva]
        this.nuevaId = nueva.idRecommendation
        this.generandoId = null
        this.mensaje = 'Recomendación generada con IA.'
        this.cdr.detectChanges()
      }, error: err => {
        this.generandoId = null
        this.mensaje = err.status === 429
          ? 'Se alcanzó el límite de uso de la IA (es gratuita y tiene tope). Intente de nuevo en un minuto.'
          : 'No se pudo generar la recomendación con IA. Intente nuevamente en unos segundos.'
        this.cdr.detectChanges()
      }
    })
  }
}
