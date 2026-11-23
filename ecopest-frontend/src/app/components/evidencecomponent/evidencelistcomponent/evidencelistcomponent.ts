import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EvidenceDTO } from '../../../models/EvidenceDTO';
import { Evidenceservice } from '../../../services/evidenceservice';
import { Incidentservice } from '../../../services/incidentservice';

@Component({
  selector: 'app-evidencelistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './evidencelistcomponent.html',
  styleUrl: './evidencelistcomponent.css',
})
export class Evidencelistcomponent implements OnInit {

  // ADMIN y SUPERVISOR pueden registrar y editar; solo ADMIN elimina
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6']
  dataSource: EvidenceDTO[] = []
  terminoBusqueda: string = ''
  mensaje: string = ''
  incidentes: any[] = []

  constructor(
    private loginS: Loginservice,
    private s: Evidenceservice,
    private cdr: ChangeDetectorRef,
    private incidentS: Incidentservice
  ) { }

  ngOnInit(): void {
    this.obtenerEvidencias()
    this.incidentS.getIncidents().subscribe({
      next: data => {
        this.incidentes = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  obtenerEvidencias(): void {
    this.s.getEvidences().subscribe({
      next: data => {
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.cdr.detectChanges()
      }
    })
  }

  eliminarEvidencia(id: number): void {
    if (!window.confirm(`¿Seguro que deseas eliminar la evidencia #${id}? Esta acción no se puede deshacer.`)) {
      return
    }

    this.s.deleteEvidence(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerEvidencias()
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

  limpiarBusqueda(): void {
    this.terminoBusqueda = ''
  }

  get filasFiltradas(): EvidenceDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    if (!termino) {
      return this.dataSource
    }

    return this.dataSource.filter(evidencia =>
      [
        evidencia.idEvidence,
        evidencia.fileUrl,
        evidencia.fileType,
        evidencia.uploadDate,
        this.nombreIncidente(evidencia.incidentId)
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))
    )
  }

  nombreIncidente(id: number | null): string {
    const x = this.incidentes.find(item => item.idIncident === id)
    return x ? '#' + x.idIncident + ' - ' + x.description : ''
  }
}
