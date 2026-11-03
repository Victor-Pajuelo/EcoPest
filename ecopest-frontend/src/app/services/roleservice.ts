import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoleDTO } from '../models/RoleDTO';


@Injectable({
  providedIn: 'root',
})
export class Roleservice {
  private apiURL = `${environment.base}/api/roles`;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(this.apiURL);
  }

  getRoleById(id: number): Observable<RoleDTO> {
    return this.http.get<RoleDTO>(`${this.apiURL}/${id}`);
  }

  insertRole(item: RoleDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(this.apiURL, item);
  }

  updateRole(item: RoleDTO): Observable<RoleDTO> {
    return this.http.put<RoleDTO>(this.apiURL, item);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
