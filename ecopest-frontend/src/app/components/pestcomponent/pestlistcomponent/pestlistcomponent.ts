import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PestTypeDTO } from '../../../models/PestTypeDTO';
import { Pestservice } from '../../../services/pestservice';

@Component({
  selector: 'app-pestlistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './pestlistcomponent.html',
  styleUrl: './pestlistcomponent.css',
})
export class Pestlistcomponent implements OnInit {

  // ADMIN y SUPERVISOR pueden registrar y editar; solo ADMIN elimina
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4', 'C5']
  dataSource: PestTypeDTO[] = []
  terminoBusqueda: string = ''
  mensaje: string = ''

  constructor(
    private loginS: Loginservice,
    private s: Pestservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerPlagas()
  }

  obtenerPlagas(): void {
    this.s.getPests().subscribe({
      next: data => {
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.cdr.detectChanges()
      }
    })
  }

  actualizarBusqueda(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.terminoBusqueda = event.target.value
    }
  }

  get filasFiltradas(): PestTypeDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    if (!termino) {
      return this.dataSource
    }

    return this.dataSource.filter(plaga =>
      [
        plaga.idPestType,
        plaga.name,
        plaga.riskLevel,
        plaga.description
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))
    )
  }

  eliminarPlaga(id: number): void {
    if (!window.confirm(`¿Seguro que deseas eliminar la plaga #${id}? Esta acción no se puede deshacer.`)) {
      return
    }

    this.s.deletePest(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerPlagas()
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
        this.cdr.detectChanges()
      }
    })
  }
}
