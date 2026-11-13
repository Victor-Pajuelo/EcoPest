import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Climaservice } from '../../services/climaservice';
import { ClimaDTO } from '../../models/ClimaDTO';
import { ForecastDayDTO } from '../../models/ForecastDayDTO';
import { Weatherservice } from '../../services/weatherservice';

@Component({
  selector: 'app-climacomponent',
  imports: [MatIconModule, DatePipe, DecimalPipe],
  templateUrl: './climacomponent.html',
  styleUrl: './climacomponent.css',
})
export class Climacomponent implements OnInit {

  clima: ClimaDTO = new ClimaDTO()
  cargado: boolean = false
  mensaje: string = ''
  pronostico: ForecastDayDTO[] = []
  mensajePronostico: string = 'Cargando pronóstico...'

  constructor(private cS: Climaservice, private w: Weatherservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // Se pide la ubicación del navegador; si no se permite, se usa Lima
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => this.obtenerClima(pos.coords.latitude, pos.coords.longitude),
        () => this.obtenerClima(-12.0464, -77.0428)
      )
    } else {
      this.obtenerClima(-12.0464, -77.0428)
    }
  }

  obtenerClima(latitud: number, longitud: number): void {
    this.obtenerPronostico(latitud, longitud)
    this.cS.getClima(latitud, longitud).subscribe({
      next: data => {
        this.clima = data
        this.cargado = true
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se pudo obtener el clima'
        this.cdr.detectChanges()
      }
    })
  }

  // Pronóstico de 5 días con riesgo de plaga (el backend consulta Open-Meteo)
  obtenerPronostico(latitud: number, longitud: number): void {
    this.w.getForecast(latitud, longitud, 5).subscribe({
      next: data => {
        this.pronostico = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensajePronostico = 'No se pudo obtener el pronóstico'
        this.cdr.detectChanges()
      }
    })
  }
}
