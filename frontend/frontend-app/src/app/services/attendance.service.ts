import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private baseUrl = 'http://localhost:3000/api/attendance';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  markAttendance(studentId: string, status: 'Present' | 'Absent', subject: string, date?: string) {
    return this.http.post(this.baseUrl, {
      studentId,
      date: date || new Date().toISOString(),
      status,
      subject
    }, { headers: this.getHeaders() });
  }

  getAttendance(studentId: string) {
    return this.http.get(`${this.baseUrl}/${studentId}`, { headers: this.getHeaders() });
  }
}
