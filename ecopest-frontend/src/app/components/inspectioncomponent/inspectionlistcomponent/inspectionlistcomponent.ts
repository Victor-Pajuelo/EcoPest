import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InspectionDTO } from '../../../models/InspectionDTO';
import { Inspectionservice } from '../../../services/inspectionservice';
import { Businessservice } from '../../../services/businessservice';
import { Userservice } from '../../../services/userservice';

@Component({
  selector: 'app-inspectionlistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './inspectionlistcomponent.html',
  styleUrl: './inspectionlistcomponent.css',
})
export class Inspectionlistcomponent implements OnInit {

  // ADMIN y SUPERVISOR pueden registrar y editar; solo ADMIN elimina
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7']
  dataSource: InspectionDTO[] = []
  terminoBusqueda: string = ''
  mensaje: string = ''
  empresas: any[] = []
  usuarios: any[] = []

  constructor(
    private loginS: Loginservice,
    private s: Inspectionservice,
    private cdr: ChangeDetectorRef,
    private businessS: Businessservice,
    private userS: Userservice
  ) { }

  ngOnInit(): void {
    this.obtenerInspecciones()
    this.businessS.getBusinesses().subscribe({
      next: data => {
        this.empresas = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
    this.userS.getUsers().subscribe({
      next: data => {
        this.usuarios = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  obtenerInspecciones(): void {
    this.s.getInspections().subscribe({
      next: data => {
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.cdr.detectChanges()
      }
    })
  }

  eliminarInspeccion(id: number): void {
    if (!window.confirm(`¿Seguro que deseas eliminar la inspección #${id}? Esta acción no se puede deshacer.`)) {
      return
    }

    this.s.deleteInspection(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerInspecciones()
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

  get filasFiltradas(): InspectionDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    if (!termino) {
      return this.dataSource
    }

    return this.dataSource.filter(inspeccion =>
      [
        inspeccion.idInspection,
        inspeccion.inspectionDate,
        inspeccion.status,
        inspeccion.observations,
        this.nombreEmpresa(inspeccion.businessEntityId),
        this.nombreUsuario(inspeccion.userId)
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))
    )
  }

  nombreEmpresa(id: number | null): string {
    const x = this.empresas.find(item => item.idBusinessEntity === id)
    return x ? x.name : ''
  }

  nombreUsuario(id: number | null): string {
    const x = this.usuarios.find(item => item.idUser === id)
    return x ? x.name : ''
  }
}
