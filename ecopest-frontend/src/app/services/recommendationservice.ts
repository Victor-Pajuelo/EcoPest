import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RecommendationDTO } from '../models/RecommendationDTO';


@Injectable({
  providedIn: 'root',
})
export class Recommendationservice {
  private apiURL = `${environment.base}/api/recommendations`;

  constructor(private http: HttpClient) {}

  getRecommendations(): Observable<RecommendationDTO[]> {
    return this.http.get<RecommendationDTO[]>(this.apiURL);
  }

  getRecommendationById(id: number): Observable<RecommendationDTO> {
    return this.http.get<RecommendationDTO>(`${this.apiURL}/${id}`);
  }

  insertRecommendation(item: RecommendationDTO): Observable<RecommendationDTO> {
    return this.http.post<RecommendationDTO>(this.apiURL, item);
  }

  updateRecommendation(item: RecommendationDTO): Observable<RecommendationDTO> {
    return this.http.put<RecommendationDTO>(this.apiURL, item);
  }

  deleteRecommendation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  /** Genera con IA (Gemini) una recomendacion para el incidente y la guarda. */
  generateWithAI(incidentId: number): Observable<RecommendationDTO> {
    const params = new HttpParams().set('incidentId', incidentId);
    return this.http.post<RecommendationDTO>(`${this.apiURL}/generate`, null, { params });
  }

  getByIncident(incidentId: number): Observable<RecommendationDTO[]> {
    const params = new HttpParams().set('incidentId', incidentId);
    return this.http.get<RecommendationDTO[]>(`${this.apiURL}/by-incident`, { params });
  }
}
