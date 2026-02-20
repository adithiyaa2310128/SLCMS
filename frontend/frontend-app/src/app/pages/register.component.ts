import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-box">
        <h2>Create Account</h2>
        <p>Sign up to get started</p>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" required placeholder="Enter your full name">
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required placeholder="Create a password">
          </div>

          <div class="form-check">
            <input type="checkbox" [(ngModel)]="isAlumni" name="isAlumni" id="alumniCheck">
            <label for="alumniCheck">I am an Alumni</label>
          </div>

          <div *ngIf="isAlumni" class="alumni-fields">
            <div class="form-group">
              <label>Company</label>
              <input type="text" [(ngModel)]="company" name="company" placeholder="Current Company">
            </div>
            <div class="form-group">
              <label>Job Role</label>
              <input type="text" [(ngModel)]="jobRole" name="jobRole" placeholder="e.g. Software Engineer">
            </div>
             <div class="form-group">
              <label>Batch</label>
              <input type="text" [(ngModel)]="batch" name="batch" placeholder="e.g. 2023">
            </div>
          </div>

          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" [disabled]="isLoading">
            {{ isLoading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <div class="auth-footer">
          Already have an account? <a routerLink="/login">Login</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Reusing similar styles for consistency */
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
      background: #2ecc71;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover {
      background: #27ae60;
    }
    button:disabled {
      background: #bdc3c7;
      cursor: not-allowed;
    }
    .form-check {
      display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;
    }
    .form-check input { width: auto; }
    .alumni-fields {
      background: #f8f9fa; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;
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
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  isAlumni = false;
  company = '';
  jobRole = '';
  batch = '';
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    if (!this.email || !this.password || !this.name) return;

    this.isLoading = true;
    this.error = '';

    const userData: any = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    if (this.isAlumni) {
      userData.role = 'Alumni';
      userData.isAlumni = true;
      userData.company = this.company;
      userData.jobRole = this.jobRole;
      userData.batch = this.batch;
    }

    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Registration failed';
      }
    });
  }
}
