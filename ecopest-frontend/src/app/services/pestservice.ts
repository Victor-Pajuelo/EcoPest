import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PestTypeDTO } from '../models/PestTypeDTO';


@Injectable({
  providedIn: 'root',
})
export class Pestservice {
  private apiURL = `${environment.base}/api/pest-types`;

  constructor(private http: HttpClient) {}

  getPests(): Observable<PestTypeDTO[]> {
    return this.http.get<PestTypeDTO[]>(this.apiURL);
  }

  getPestById(id: number): Observable<PestTypeDTO> {
    return this.http.get<PestTypeDTO>(`${this.apiURL}/${id}`);
  }

  insertPest(item: PestTypeDTO): Observable<PestTypeDTO> {
    return this.http.post<PestTypeDTO>(this.apiURL, item);
  }

  updatePest(item: PestTypeDTO): Observable<PestTypeDTO> {
    return this.http.put<PestTypeDTO>(this.apiURL, item);
  }

  deletePest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
