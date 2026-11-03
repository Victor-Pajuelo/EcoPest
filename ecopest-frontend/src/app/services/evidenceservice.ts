import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EvidenceDTO } from '../models/EvidenceDTO';


@Injectable({
  providedIn: 'root',
})
export class Evidenceservice {
  private apiURL = `${environment.base}/api/evidence`;

  constructor(private http: HttpClient) {}

  getEvidences(): Observable<EvidenceDTO[]> {
    return this.http.get<EvidenceDTO[]>(this.apiURL);
  }

  getEvidenceById(id: number): Observable<EvidenceDTO> {
    return this.http.get<EvidenceDTO>(`${this.apiURL}/${id}`);
  }

  insertEvidence(item: EvidenceDTO): Observable<EvidenceDTO> {
    return this.http.post<EvidenceDTO>(this.apiURL, item);
  }

  updateEvidence(item: EvidenceDTO): Observable<EvidenceDTO> {
    return this.http.put<EvidenceDTO>(this.apiURL, item);
  }

  deleteEvidence(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
