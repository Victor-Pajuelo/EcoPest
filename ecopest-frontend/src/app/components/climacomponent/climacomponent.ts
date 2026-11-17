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
  lugar: string = ''
  latitud: number = -12.0464
  longitud: number = -77.0428

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
    this.latitud = latitud
    this.longitud = longitud
    this.obtenerPronostico(latitud, longitud)
    this.obtenerLugar(latitud, longitud)
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

  // Nombre del lugar (distrito y ciudad) con la API Nominatim; si falla se muestra la zona horaria
  obtenerLugar(latitud: number, longitud: number): void {
    this.cS.getLugar(latitud, longitud).subscribe({
      next: data => {
        const d = data.address
        const distrito = d.suburb || d.city_district || d.quarter || d.neighbourhood || d.village || ''
        const ciudad = d.city || d.town || d.state || ''
        this.lugar = [distrito, ciudad].filter(x => x).join(', ')
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  reintentarPronostico(): void {
    this.mensajePronostico = 'Cargando pronóstico...'
    this.obtenerPronostico(this.latitud, this.longitud)
  }

  // Pronóstico de 5 días con riesgo de plaga (el backend consulta Open-Meteo)
  obtenerPronostico(latitud: number, longitud: number): void {
    this.w.getForecast(latitud, longitud, 5).subscribe({
      next: data => {
        this.pronostico = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensajePronostico = 'No se pudo obtener el pronóstico. El servidor gratuito tarda en iniciar; vuelva a intentar en unos segundos.'
        this.cdr.detectChanges()
      }
    })
  }
}
