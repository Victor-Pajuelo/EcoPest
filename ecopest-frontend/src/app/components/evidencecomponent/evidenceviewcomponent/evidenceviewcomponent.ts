import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EvidenceDTO } from '../../../models/EvidenceDTO';
import { Evidenceservice } from '../../../services/evidenceservice';
import { Incidentservice } from '../../../services/incidentservice';

@Component({
  selector: 'app-evidenceviewcomponent',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './evidenceviewcomponent.html',
  styleUrl: './evidenceviewcomponent.css',
})
export class Evidenceviewcomponent implements OnInit {

  evidencia: EvidenceDTO = new EvidenceDTO()
  incidente: string = ''
  mensaje: string = ''

  constructor(
    private s: Evidenceservice,
    private incidentS: Incidentservice,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))

    this.s.getEvidenceById(id).subscribe({
      next: data => {
        this.evidencia = data
        if (data.incidentId) {
          this.incidentS.getIncidentById(data.incidentId).subscribe(inc => {
            this.incidente = '#' + inc.idIncident + ' - ' + inc.description
            this.cdr.detectChanges()
          })
        }
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se encontró la evidencia!!'
        this.cdr.detectChanges()
      }
    })
  }

  // Muestra la vista previa solo si el archivo es una imagen
  esImagen(): boolean {
    const tipo = (this.evidencia.fileType || '').toLowerCase()
    const url = (this.evidencia.fileUrl || '').toLowerCase()
    return tipo.includes('image') || tipo.includes('imagen') || /\.(jpg|jpeg|png|gif|webp)$/.test(url)
  }
}
