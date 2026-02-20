import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class MarksService {
    private apiUrl = 'http://localhost:3000/api/marks';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders() {
        const token = this.authService.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    addMarks(data: any) {
        return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
    }

    getMarksByStudent(studentId: string) {
        return this.http.get(`${this.apiUrl}/${studentId}`, { headers: this.getHeaders() });
    }
}
