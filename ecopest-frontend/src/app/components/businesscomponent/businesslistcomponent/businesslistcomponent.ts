import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BusinessDTO } from '../../../models/BusinessDTO';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-businesslistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './businesslistcomponent.html',
  styleUrl: './businesslistcomponent.css',
})
export class Businesslistcomponent implements OnInit {

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6']
  dataSource: BusinessDTO[] = []
  mensaje: string = ''

  constructor(
    private s: Businessservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerEmpresas()
  }

  obtenerEmpresas(): void {
    this.s.getBusinesses().subscribe({
      next: data => {
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.cdr.detectChanges()
      }
    })
  }

  eliminarEmpresa(id: number): void {
    this.s.deleteBusiness(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerEmpresas()
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
        this.cdr.detectChanges()
      }
    })
  }
}
