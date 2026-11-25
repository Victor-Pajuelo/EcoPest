import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IncidentDTO } from '../../../models/IncidentDTO';
import { Incidentservice } from '../../../services/incidentservice';
import { Pestservice } from '../../../services/pestservice';
import { Inspectionservice } from '../../../services/inspectionservice';

@Component({
  selector: 'app-incidentviewcomponent',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './incidentviewcomponent.html',
  styleUrl: './incidentviewcomponent.css',
})
export class Incidentviewcomponent implements OnInit {

  incidente: IncidentDTO = new IncidentDTO()
  plaga: string = ''
  inspeccion: string = ''
  mensaje: string = ''

  constructor(
    private s: Incidentservice,
    private pestS: Pestservice,
    private inspectionS: Inspectionservice,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))

    this.s.getIncidentById(id).subscribe({
      next: data => {
        this.incidente = data
        this.cargarRelacionados()
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se encontró el incidente!!'
        this.cdr.detectChanges()
      }
    })
  }

  // Trae el nombre de la plaga y los datos de la inspección para no mostrar solo los IDs
  cargarRelacionados(): void {
    if (this.incidente.pestTypeId) {
      this.pestS.getPestById(this.incidente.pestTypeId).subscribe(data => {
        this.plaga = data.name
        this.cdr.detectChanges()
      })
    }
    if (this.incidente.inspectionId) {
      this.inspectionS.getInspectionById(this.incidente.inspectionId).subscribe(data => {
        this.inspeccion = '#' + data.idInspection + ' - ' + data.inspectionDate
        this.cdr.detectChanges()
      })
    }
  }
}
