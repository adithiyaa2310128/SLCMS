import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="auth-container">
      <div class="auth-box">
        <h2>Welcome Back</h2>
        <p>Login to your account</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="Enter your password">
          </div>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" [disabled]="isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <div class="auth-footer">
          Don't have an account? <a routerLink="/register">Register</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .auth-box {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    p {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #34495e;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    input:focus {
      border-color: #3498db;
      outline: none;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #3498db;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover {
      background: #2980b9;
    }
    button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    .error-message {
      color: #e74c3c;
      text-align: center;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: #7f8c8d;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
    email = '';
    password = '';
    isLoading = false;
    error = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        if (!this.email || !this.password) return;

        this.isLoading = true;
        this.error = '';

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.isLoading = false;
                this.error = err.error?.message || 'Login failed';
            }
        });
    }
}
