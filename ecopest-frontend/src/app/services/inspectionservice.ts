import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { InspectionDTO } from '../models/InspectionDTO';


@Injectable({
  providedIn: 'root',
})
export class Inspectionservice {
  private apiURL = `${environment.base}/api/inspections`;

  constructor(private http: HttpClient) {}

  getInspections(): Observable<InspectionDTO[]> {
    return this.http.get<InspectionDTO[]>(this.apiURL);
  }

  getInspectionById(id: number): Observable<InspectionDTO> {
    return this.http.get<InspectionDTO>(`${this.apiURL}/${id}`);
  }

  insertInspection(item: InspectionDTO): Observable<InspectionDTO> {
    return this.http.post<InspectionDTO>(this.apiURL, item);
  }

  updateInspection(item: InspectionDTO): Observable<InspectionDTO> {
    return this.http.put<InspectionDTO>(this.apiURL, item);
  }

  deleteInspection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
