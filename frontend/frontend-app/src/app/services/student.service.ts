import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private baseUrl = 'http://localhost:3000/api/students';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllStudents() {
    return this.http.get(this.baseUrl, { headers: this.getHeaders() });
  }

  createStudent(studentData: any) {
    return this.http.post(this.baseUrl, studentData, { headers: this.getHeaders() });
  }

  getStudentById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  updateStudent(id: string, studentData: any) {
    return this.http.put(`${this.baseUrl}/${id}`, studentData, { headers: this.getHeaders() });
  }

  deleteStudent(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}
