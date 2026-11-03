import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherDataDTO } from '../models/WeatherDataDTO';
import { AverageWeatherDTO } from '../models/CountDTO';

@Injectable({
  providedIn: 'root',
})
export class Weatherservice {
  private apiURL = `${environment.base}/api/weather-data`;

  constructor(private http: HttpClient) {}

  getWeatherRecords(): Observable<WeatherDataDTO[]> {
    return this.http.get<WeatherDataDTO[]>(this.apiURL);
  }

  getWeatherById(id: number): Observable<WeatherDataDTO> {
    return this.http.get<WeatherDataDTO>(`${this.apiURL}/${id}`);
  }

  insertWeather(item: WeatherDataDTO): Observable<WeatherDataDTO> {
    return this.http.post<WeatherDataDTO>(this.apiURL, item);
  }

  updateWeather(item: WeatherDataDTO): Observable<WeatherDataDTO> {
    return this.http.put<WeatherDataDTO>(this.apiURL, item);
  }

  deleteWeather(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  /** Clima real desde Open-Meteo (el backend llama a la API externa y lo guarda). */
  syncWeather(businessEntityId: number, latitude: number, longitude: number): Observable<WeatherDataDTO> {
    const params = new HttpParams()
      .set('businessEntityId', businessEntityId)
      .set('latitude', latitude)
      .set('longitude', longitude);
    return this.http.post<WeatherDataDTO>(`${this.apiURL}/sync`, null, { params });
  }

  simulateWeather(businessEntityId: number, days: number): Observable<WeatherDataDTO[]> {
    const params = new HttpParams().set('businessEntityId', businessEntityId).set('days', days);
    return this.http.post<WeatherDataDTO[]>(`${this.apiURL}/simulate`, null, { params });
  }

  getAverages(): Observable<AverageWeatherDTO[]> {
    return this.http.get<AverageWeatherDTO[]>(`${this.apiURL}/averages`);
  }
}
