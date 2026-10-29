import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BusinessDTO } from '../models/BusinessDTO';


@Injectable({
  providedIn: 'root',
})
export class Businessservice {
  private apiURL = `${environment.base}/api/business-entities`;

  constructor(private http: HttpClient) {}

  getBusinesses(): Observable<BusinessDTO[]> {
    return this.http.get<BusinessDTO[]>(this.apiURL);
  }

  getBusinessById(id: number): Observable<BusinessDTO> {
    return this.http.get<BusinessDTO>(`${this.apiURL}/${id}`);
  }

  insertBusiness(item: BusinessDTO): Observable<BusinessDTO> {
    return this.http.post<BusinessDTO>(this.apiURL, item);
  }

  updateBusiness(item: BusinessDTO): Observable<BusinessDTO> {
    return this.http.put<BusinessDTO>(this.apiURL, item);
  }

  deleteBusiness(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
