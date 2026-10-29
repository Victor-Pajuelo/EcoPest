import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CountDTO } from '../models/CountDTO';

/** Endpoints de reportes (consultas con JOIN y GROUP BY) del backend. */
@Injectable({ providedIn: 'root' })
export class Reportservice {
  private base = environment.base;

  constructor(private http: HttpClient) {}

  private counts(path: string): Observable<CountDTO[]> {
    return this.http.get<CountDTO[]>(`${this.base}${path}`);
  }

  inspectionsByCompany() { return this.counts('/api/inspections/counts'); }
  usersByCompany() { return this.counts('/api/business-entities/counts'); }
  usersByRole() { return this.counts('/api/users/counts-by-role'); }
  incidentsByPest() { return this.counts('/api/incidents/counts'); }
  incidentsByRisk() { return this.counts('/api/incidents/counts-by-risk-level'); }
  evidenceByIncident() { return this.counts('/api/evidence/counts'); }
  recommendationsByIncident() { return this.counts('/api/recommendations/counts'); }
}
