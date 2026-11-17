import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Menucomponent } from '../menucomponent/menucomponent';
import { Reportservice } from '../../services/reportservice';
import { Weatherservice } from '../../services/weatherservice';
import { Businessservice } from '../../services/businessservice';
import { Incidentservice } from '../../services/incidentservice';
import { Inspectionservice } from '../../services/inspectionservice';
import { Recommendationservice } from '../../services/recommendationservice';
import { CountDTO } from '../../models/CountDTO';
import { AverageWeatherDTO } from '../../models/AverageWeatherDTO';

/** HU55 - Dashboard de indicadores: tarjetas con totales, graficos de barras y promedios de clima. */
@Component({
  selector: 'app-dashboardcomponent',
  imports: [Menucomponent, MatIconModule, MatTableModule, DecimalPipe],
  templateUrl: './dashboardcomponent.html',
  styleUrl: './dashboardcomponent.css',
})
export class Dashboardcomponent implements OnInit {

  totalEmpresas = 0;
  totalIncidentes = 0;
  totalInspecciones = 0;
  totalRecomendaciones = 0;

  incidentesPorPlaga: CountDTO[] = [];       // CA01
  inspeccionesPorEmpresa: CountDTO[] = [];   // CA02

  promediosClima: AverageWeatherDTO[] = [];  // CA03
  columnasClima: string[] = ['empresa', 'temperatura', 'humedad'];

  constructor(
    private reportS: Reportservice,
    private weatherS: Weatherservice,
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

    this.reportS.incidentsByPest().subscribe({
      next: data => { this.incidentesPorPlaga = data; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
    this.reportS.inspectionsByCompany().subscribe({
      next: data => { this.inspeccionesPorEmpresa = data; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
    this.weatherS.getAverages().subscribe({
      next: data => { this.promediosClima = data; this.cdr.detectChanges(); },
      error: err => console.log(err)
    });
  }

  porcentaje(valor: number, lista: CountDTO[]): number {
    const max = Math.max(...lista.map(x => x.quantity), 1);
    return Math.round((valor / max) * 100);
  }
}