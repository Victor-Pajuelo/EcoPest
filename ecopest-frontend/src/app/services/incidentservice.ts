import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IncidentDTO } from '../models/IncidentDTO';


@Injectable({
  providedIn: 'root',
})
export class Incidentservice {
  private apiURL = `${environment.base}/api/incidents`;

  constructor(private http: HttpClient) {}

  getIncidents(): Observable<IncidentDTO[]> {
    return this.http.get<IncidentDTO[]>(this.apiURL);
  }

  getIncidentById(id: number): Observable<IncidentDTO> {
    return this.http.get<IncidentDTO>(`${this.apiURL}/${id}`);
  }

  insertIncident(item: IncidentDTO): Observable<IncidentDTO> {
    return this.http.post<IncidentDTO>(this.apiURL, item);
  }

  updateIncident(item: IncidentDTO): Observable<IncidentDTO> {
    return this.http.put<IncidentDTO>(this.apiURL, item);
  }

  deleteIncident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
