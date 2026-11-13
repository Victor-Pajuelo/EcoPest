import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IncidentDTO } from '../../../models/IncidentDTO';
import { Incidentservice } from '../../../services/incidentservice';
import { Inspectionservice } from '../../../services/inspectionservice';
import { Pestservice } from '../../../services/pestservice';

@Component({
  selector: 'app-incidentlistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './incidentlistcomponent.html',
  styleUrl: './incidentlistcomponent.css',
})
export class Incidentlistcomponent implements OnInit {

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7']
  dataSource: IncidentDTO[] = []
  mensaje: string = ''
  inspecciones: any[] = []
  plagas: any[] = []

  constructor(
    private s: Incidentservice,
    private cdr: ChangeDetectorRef,
    private inspectionS: Inspectionservice,
    private pestS: Pestservice
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

  nombreInspeccion(id: number | null): string {
    const x = this.inspecciones.find(item => item.idInspection === id)
    return x ? '#' + x.idInspection + ' - ' + x.inspectionDate : ''
  }

  nombrePlaga(id: number | null): string {
    const x = this.plagas.find(item => item.idPestType === id)
    return x ? x.name : ''
  }
}
