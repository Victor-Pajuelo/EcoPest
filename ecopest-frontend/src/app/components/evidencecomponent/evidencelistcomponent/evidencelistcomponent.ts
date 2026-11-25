import { Confirmservice } from '../../confirmdialog/confirmdialog'
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EvidenceDTO } from '../../../models/EvidenceDTO';
import { Evidenceservice } from '../../../services/evidenceservice';
import { Incidentservice } from '../../../services/incidentservice';

@Component({
  selector: 'app-evidencelistcomponent',
  imports: [DatePipe, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, RouterLink],
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

  displayedColumns: string[] = ['C2', 'C3', 'C4', 'C5', 'C6']
  // Evidencias cuya imagen no se pudo cargar (enlace roto): se muestra un icono en su lugar
  imagenRota: Record<number, boolean> = {}
  dataSource: EvidenceDTO[] = []
  cargando: boolean = true
  terminoBusqueda: string = ''
  // Paginacion: 5 registros por pagina
  readonly tamPagina: number = 5
  pagina: number = 0
  mensaje: string = ''
  incidentes: any[] = []

  constructor(
    private loginS: Loginservice,
    private s: Evidenceservice,
    private cdr: ChangeDetectorRef,
    private confirmS: Confirmservice,
    private incidentS: Incidentservice
  ) { }

  ngOnInit(): void {
    this.obtenerEvidencias()
    this.incidentS.getIncidents().subscribe({
      next: data => {
        this.incidentes = data
        this.cdr.detectChanges()
      }, error: err => {
      }
    })
  }

  obtenerEvidencias(): void {
    this.s.getEvidences().subscribe({
      next: data => {
        this.cargando = false
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        this.cargando = false
        this.cdr.detectChanges()
      }
    })
  }

  eliminarEvidencia(id: number): void {
    this.confirmS.preguntar(`¿Seguro que deseas eliminar la evidencia #${id}? Esta acción no se puede deshacer.`).subscribe(ok => {
      if (!ok) {
        return
      }

      this.s.deleteEvidence(id).subscribe({
        next: () => {
          this.mensaje = ''
          this.obtenerEvidencias()
          this.cdr.detectChanges()
        }, error: err => {
          this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
          this.cdr.detectChanges()
        }
      })
    })
  }

  actualizarBusqueda(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.terminoBusqueda = event.target.value
      this.pagina = 0
    }
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = ''
    this.pagina = 0
  }

  // Si se borra o filtra y la pagina queda vacia, se muestra la ultima pagina con datos
  get paginaActual(): number {
    const ultima = Math.max(0, Math.ceil(this.filasFiltradas.length / this.tamPagina) - 1)
    return Math.min(this.pagina, ultima)
  }

  get filasPagina() {
    const inicio = this.paginaActual * this.tamPagina
    return this.filasFiltradas.slice(inicio, inicio + this.tamPagina)
  }

  cambiarPagina(event: PageEvent): void {
    this.pagina = event.pageIndex
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

  esImagen(e: EvidenceDTO): boolean {
    const tipo = (e.fileType || '').toLowerCase()
    const url = (e.fileUrl || '').toLowerCase()
    return tipo.includes('imag') || /\.(jpg|jpeg|png|gif|webp)$/.test(url)
  }

  marcarRota(id: number | null): void {
    if (id == null) return
    this.imagenRota[id] = true
    this.cdr.detectChanges()
  }

  iconoArchivo(e: EvidenceDTO): string {
    const tipo = (e.fileType || '').toLowerCase()
    if (tipo.includes('imag')) return 'broken_image'
    if (tipo.includes('pdf')) return 'picture_as_pdf'
    if (tipo.includes('video')) return 'videocam'
    return 'description'
  }
}
