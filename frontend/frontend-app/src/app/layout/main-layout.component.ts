import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="layout-container">
      <aside class="sidebar">
        <div class="logo">
          <h2>SLCMS</h2>
        </div>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active">
            <i class="icon">📊</i> Dashboard
          </a>
          <a routerLink="/students" routerLinkActive="active">
            <i class="icon">👨‍🎓</i> Students
          </a>
          <a routerLink="/attendance" routerLinkActive="active">
            <i class="icon">📅</i> Attendance
          </a>
          <a routerLink="/marks" routerLinkActive="active">
            <i class="icon">📝</i> Marks
          </a>
          <a routerLink="/alumni" routerLinkActive="active">
            <i class="icon">🎓</i> Alumni Network
          </a>
        </nav>
        <div class="logout-section">
          <button (click)="logout()">Logout</button>
        </div>
      </aside>
      
      <main class="main-content">
        <header class="top-bar">
          <div class="user-info">
             <span>Welcome, Admin</span>
          </div>
        </header>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      display: flex;
      flex-direction: column;
    }
    .logo {
      padding: 1.5rem;
      border-bottom: 1px solid #34495e;
    }
    .logo h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #ecf0f1;
    }
    nav {
      flex: 1;
      padding: 1rem 0;
    }
    nav a {
      display: flex;
      align-items: center;
      padding: 0.75rem 1.5rem;
      color: #bdc3c7;
      text-decoration: none;
      transition: background 0.3s, color 0.3s;
    }
    nav a:hover, nav a.active {
      background: #34495e;
      color: #ecf0f1;
      border-left: 4px solid #3498db;
    }
    .icon {
      margin-right: 10px;
      font-style: normal;
    }
    .logout-section {
      padding: 1rem;
      border-top: 1px solid #34495e;
    }
    .logout-section button {
      width: 100%;
      padding: 0.5rem;
      background: #c0392b;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #ecf0f1;
      overflow-y: auto;
    }
    .top-bar {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      display: flex;
      justify-content: flex-end;
    }
    .content-area {
      padding: 2rem;
    }
  `]
})
export class MainLayoutComponent {
  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
