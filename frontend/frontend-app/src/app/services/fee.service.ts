import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:3000/api/fees';

@Injectable({ providedIn: 'root' })
export class FeeService {
  constructor(private http: HttpClient) {}
  getAll(params?: any): Observable<any[]> { return this.http.get<any[]>(API, { params }); }
  getStats(): Observable<any> { return this.http.get<any>(`${API}/stats`); }
  create(data: any): Observable<any> { return this.http.post<any>(API, data); }
  recordPayment(id: string, mode: string): Observable<any> {
    return this.http.post<any>(`${API}/${id}/pay`, { paymentMode: mode });
  }
  update(id: string, data: any): Observable<any> { return this.http.put<any>(`${API}/${id}`, data); }
  delete(id: string): Observable<any> { return this.http.delete<any>(`${API}/${id}`); }
}
