import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:3000/api/leads';

@Injectable({ providedIn: 'root' })
export class LeadService {
  constructor(private http: HttpClient) {}
  getAll(): Observable<any[]> { return this.http.get<any[]>(API); }
  getStats(): Observable<any> { return this.http.get<any>(`${API}/stats`); }
  getById(id: string): Observable<any> { return this.http.get<any>(`${API}/${id}`); }
  create(data: any): Observable<any> { return this.http.post<any>(API, data); }
  update(id: string, data: any): Observable<any> { return this.http.put<any>(`${API}/${id}`, data); }
  delete(id: string): Observable<any> { return this.http.delete<any>(`${API}/${id}`); }
}
