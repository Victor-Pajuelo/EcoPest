import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Menucomponent } from '../menucomponent/menucomponent';
import { Reportservice } from '../../services/reportservice';
import { CountDTO } from '../../models/CountDTO';

/** HU82 - Reportes: grafico de barras de inspecciones por empresa. */
@Component({
  selector: 'app-reportecomponent',
  imports: [Menucomponent, MatIconModule, MatTooltipModule],
  templateUrl: './reportecomponent.html',
  styleUrl: './reportecomponent.css',
})
export class Reportecomponent implements OnInit {

  inspeccionesPorEmpresa: CountDTO[] = [];
  cargado: boolean = false;   // ya respondio el servidor
  hayError: boolean = false;  // CA03: la consulta fallo

  constructor(private reportS: Reportservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerInspeccionesPorEmpresa();
  }

  // CA01: una barra por empresa. CA03: si falla, se marca el error.
  obtenerInspeccionesPorEmpresa(): void {
    this.hayError = false;
    this.cargado = false;
    this.reportS.inspectionsByCompany().subscribe({
      next: data => {
        this.inspeccionesPorEmpresa = data;
        this.cargado = true;
        this.cdr.detectChanges();
      },
      error: err => {
        console.log(err);
        this.hayError = true;
        this.cargado = true;
        this.cdr.detectChanges();
      }
    });
  }

  /** Ancho en % de una barra, comparando contra el valor mas alto de la lista. */
  porcentaje(valor: number): number {
    const max = Math.max(...this.inspeccionesPorEmpresa.map(x => x.quantity), 1);
    return Math.round((valor / max) * 100);
  }
}