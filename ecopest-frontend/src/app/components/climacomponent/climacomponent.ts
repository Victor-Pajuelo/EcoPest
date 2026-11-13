import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Climaservice } from '../../services/climaservice';
import { ClimaDTO } from '../../models/ClimaDTO';

@Component({
  selector: 'app-climacomponent',
  imports: [MatIconModule],
  templateUrl: './climacomponent.html',
  styleUrl: './climacomponent.css',
})
export class Climacomponent implements OnInit {

  clima: ClimaDTO = new ClimaDTO()
  cargado: boolean = false
  mensaje: string = ''

  constructor(private cS: Climaservice, private cdr: ChangeDetectorRef) { }

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
}
