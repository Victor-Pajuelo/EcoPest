import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClimaDTO } from '../models/ClimaDTO';

@Injectable({
  providedIn: 'root',
})
export class Climaservice {
  // API externa gratuita Open-Meteo (no necesita clave)
  private apiURL = 'https://api.open-meteo.com/v1/forecast';

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
}
