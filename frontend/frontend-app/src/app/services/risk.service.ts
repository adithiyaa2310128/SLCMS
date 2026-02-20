import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class RiskService {
    private apiUrl = 'http://localhost:3000/api/risk';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders() {
        const token = this.authService.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getAtRiskStudents() {
        return this.http.get(`${this.apiUrl}/at-risk`, { headers: this.getHeaders() });
    }
}
