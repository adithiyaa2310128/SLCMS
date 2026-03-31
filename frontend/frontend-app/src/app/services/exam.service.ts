import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API = 'http://localhost:3000/api/exams';

@Injectable({ providedIn: 'root' })
export class ExamService {
  constructor(private http: HttpClient) {}
  getAll(params?: any): Observable<any[]> { return this.http.get<any[]>(API, { params }); }
  getCGPA(studentId: string): Observable<any> { return this.http.get<any>(`${API}/cgpa/${studentId}`); }
  addResult(data: any): Observable<any> { return this.http.post<any>(API, data); }
  update(id: string, data: any): Observable<any> { return this.http.put<any>(`${API}/${id}`, data); }
  delete(id: string): Observable<any> { return this.http.delete<any>(`${API}/${id}`); }
}
