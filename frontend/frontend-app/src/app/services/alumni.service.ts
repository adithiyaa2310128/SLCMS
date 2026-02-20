import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AlumniService {
    private apiUrl = 'http://localhost:3000/api/alumni';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders() {
        const token = this.authService.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    getAlumni(company?: string) {
        let url = this.apiUrl;
        if (company) {
            url += `?company=${encodeURIComponent(company)}`;
        }
        return this.http.get(url, { headers: this.getHeaders() });
    }

    getAlumniById(id: string) {
        return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    createAlumni(data: any) {
        return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
    }

    updateAlumni(id: string, data: any) {
        return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getHeaders() });
    }

    deleteAlumni(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }
}
