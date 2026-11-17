import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Menucomponent } from '../menucomponent/menucomponent';
import { Reportservice } from '../../services/reportservice';
import { Businessservice } from '../../services/businessservice';
import { Incidentservice } from '../../services/incidentservice';
import { Inspectionservice } from '../../services/inspectionservice';
import { Recommendationservice } from '../../services/recommendationservice';
import { CountDTO } from '../../models/CountDTO';

/** HU55 - Dashboard de indicadores: tarjetas con totales y graficos de barras simples. */
@Component({
  selector: 'app-dashboardcomponent',
  imports: [Menucomponent, MatIconModule],
  templateUrl: './dashboardcomponent.html',
  styleUrl: './dashboardcomponent.css',
})
export class Dashboardcomponent implements OnInit {

  totalEmpresas = 0;
  totalIncidentes = 0;
  totalInspecciones = 0;
  totalRecomendaciones = 0;

  inspeccionesPorEmpresa: CountDTO[] = [];
  incidentesPorRiesgo: CountDTO[] = [];
  recomendacionesPorIncidente: CountDTO[] = [];
  usuariosPorRol: CountDTO[] = [];

  constructor(
    private reportS: Reportservice,
    private businessS: Businessservice,
    private incidentS: Incidentservice,
    private inspectionS: Inspectionservice,
    private recommendationS: Recommendationservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.businessS.getBusinesses().subscribe({
      next: data => { this.totalEmpresas = data.length; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
    this.incidentS.getIncidents().subscribe({
      next: data => { this.totalIncidentes = data.length; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
    this.inspectionS.getInspections().subscribe({
      next: data => { this.totalInspecciones = data.length; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
    this.recommendationS.getRecommendations().subscribe({
      next: data => { this.totalRecomendaciones = data.length; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });

    this.reportS.inspectionsByCompany().subscribe({
      next: data => { this.inspeccionesPorEmpresa = data; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
    this.reportS.incidentsByRisk().subscribe({
      next: data => { this.incidentesPorRiesgo = data; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
    this.reportS.recommendationsByIncident().subscribe({
      next: data => { this.recomendacionesPorIncidente = data; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
    this.reportS.usersByRole().subscribe({
      next: data => { this.usuariosPorRol = data; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
  }

  porcentaje(valor: number, lista: CountDTO[]): number {
    const max = Math.max(...lista.map(x => x.quantity), 1);
    return Math.round((valor / max) * 100);
  }
}