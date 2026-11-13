import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WeatherDataDTO } from '../../../models/WeatherDataDTO';
import { Weatherservice } from '../../../services/weatherservice';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-weatherlistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './weatherlistcomponent.html',
  styleUrl: './weatherlistcomponent.css',
})
export class Weatherlistcomponent implements OnInit {

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7']
  dataSource: WeatherDataDTO[] = []
  mensaje: string = ''
  empresas: any[] = []

  constructor(
    private s: Weatherservice,
    private cdr: ChangeDetectorRef,
    private businessS: Businessservice
  ) { }

  ngOnInit(): void {
    this.obtenerClima()
    this.businessS.getBusinesses().subscribe({
      next: data => {
        this.empresas = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  obtenerClima(): void {
    this.s.getWeatherRecords().subscribe({
      next: data => {
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.cdr.detectChanges()
      }
    })
  }

  eliminarClima(id: number): void {
    this.s.deleteWeather(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerClima()
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
        this.cdr.detectChanges()
      }
    })
  }

  nombreEmpresa(id: number | null): string {
    const x = this.empresas.find(item => item.idBusinessEntity === id)
    return x ? x.name : ''
  }
}
