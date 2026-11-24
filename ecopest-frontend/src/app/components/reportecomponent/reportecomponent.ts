import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Menucomponent } from '../menucomponent/menucomponent';
import { Reportservice } from '../../services/reportservice';
import { CountDTO } from '../../models/CountDTO';

/** HU82 (inspecciones por empresa) y HU81 (incidencias por tipo de plaga): reportes con graficos de barras. */
@Component({
  selector: 'app-reportecomponent',
  imports: [Menucomponent, MatIconModule, MatTooltipModule],
  templateUrl: './reportecomponent.html',
  styleUrl: './reportecomponent.css',
})
export class Reportecomponent implements OnInit {

  // HU82: inspecciones por empresa
  inspeccionesPorEmpresa: CountDTO[] = [];
  cargadoInspecciones: boolean = false;
  errorInspecciones: boolean = false;

  // HU81: incidencias por tipo de plaga
  incidenciasPorPlaga: CountDTO[] = [];
  cargadoPlagas: boolean = false;
  errorPlagas: boolean = false;

  constructor(private reportS: Reportservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerInspeccionesPorEmpresa();
    this.obtenerIncidenciasPorPlaga();
  }

  obtenerInspeccionesPorEmpresa(): void {
    this.errorInspecciones = false;
    this.cargadoInspecciones = false;
    this.reportS.inspectionsByCompany().subscribe({
      next: data => {
        this.inspeccionesPorEmpresa = data;
        this.cargadoInspecciones = true;
        this.cdr.detectChanges();
      },
      error: err => {
        console.log(err);
        this.errorInspecciones = true;
        this.cargadoInspecciones = true;
        this.cdr.detectChanges();
      }
    });
  }

  obtenerIncidenciasPorPlaga(): void {
    this.errorPlagas = false;
    this.cargadoPlagas = false;
    this.reportS.incidentsByPest().subscribe({
      next: data => {
        this.incidenciasPorPlaga = data;
        this.cargadoPlagas = true;
        this.cdr.detectChanges();
      },
      error: err => {
        console.log(err);
        this.errorPlagas = true;
        this.cargadoPlagas = true;
        this.cdr.detectChanges();
      }
    });
  }

  /** Ancho en % de una barra, comparando contra el valor mas alto de su lista. */
  porcentaje(valor: number, lista: CountDTO[]): number {
    const max = Math.max(...lista.map(x => x.quantity), 1);
    return Math.round((valor / max) * 100);
  }
}