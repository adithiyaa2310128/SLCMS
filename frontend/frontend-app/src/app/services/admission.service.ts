import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:3000/api/admissions';

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<any[]> { return this.http.get<any[]>(API); }
  getStats(): Observable<any> { return this.http.get<any>(`${API}/stats`); }
  create(data: any): Observable<any> { return this.http.post<any>(API, data); }
  update(id: string, data: any): Observable<any> { return this.http.put<any>(`${API}/${id}`, data); }
  enroll(id: string): Observable<any> { return this.http.post<any>(`${API}/${id}/enroll`, {}); }
  delete(id: string): Observable<any> { return this.http.delete<any>(`${API}/${id}`); }
}
