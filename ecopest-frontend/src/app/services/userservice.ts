import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDTO } from '../models/UserDTO';


@Injectable({
  providedIn: 'root',
})
export class Userservice {
  private apiURL = `${environment.base}/api/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.apiURL);
  }

  getUserById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.apiURL}/${id}`);
  }

  insertUser(item: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.apiURL, item);
  }

  updateUser(item: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(this.apiURL, item);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }
}
