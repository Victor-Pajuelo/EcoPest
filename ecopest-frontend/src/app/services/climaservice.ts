import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { ClimaDTO } from '../models/ClimaDTO';
import { LugarDTO } from '../models/LugarDTO';

@Injectable({
  providedIn: 'root',
})
export class Climaservice {
  // API externa gratuita Open-Meteo (no necesita clave)
  private apiURL = 'https://api.open-meteo.com/v1/forecast';
  // API externa gratuita Nominatim (OpenStreetMap): convierte coordenadas en el nombre del lugar
  private lugarURL = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient) { }

  getClima(latitud: number, longitud: number): Observable<ClimaDTO> {
    return this.http.get<ClimaDTO>(this.apiURL, {
      params: {
        latitude: latitud,
        longitude: longitud,
        current: 'temperature_2m,relative_humidity_2m',
        timezone: 'auto'
      }
    });
  }

  // Nominatim pide no repetir consultas: se guarda el lugar de cada zona ya consultada
  private lugares: { [zona: string]: LugarDTO } = {}

  getLugar(latitud: number, longitud: number): Observable<LugarDTO> {
    const zona = latitud.toFixed(2) + ',' + longitud.toFixed(2)
    if (this.lugares[zona]) {
      return of(this.lugares[zona])
    }
    return this.http.get<LugarDTO>(this.lugarURL, {
      params: {
        format: 'jsonv2',
        lat: latitud,
        lon: longitud,
        zoom: 14,
        'accept-language': 'es'
      }
    }).pipe(tap(lugar => this.lugares[zona] = lugar));
  }
}
