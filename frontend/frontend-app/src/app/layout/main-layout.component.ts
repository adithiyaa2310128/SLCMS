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
          <div class="logo-icon">🎓</div>
          <div class="logo-text">
            <h2>SLCMS</h2>
            <span>Student Lifecycle</span>
          </div>
        </div>

        <nav>
          <div class="nav-section">
            <span class="nav-label">Overview</span>
            <a routerLink="/dashboard" routerLinkActive="active">
              <i class="icon">📊</i><span>Dashboard</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">Lead & Admission</span>
            <a routerLink="/leads" routerLinkActive="active">
              <i class="icon">📋</i><span>Lead Management</span>
            </a>
            <a routerLink="/admissions" routerLinkActive="active">
              <i class="icon">📝</i><span>Admissions</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">Students</span>
            <a routerLink="/students" routerLinkActive="active">
              <i class="icon">👨‍🎓</i><span>Student Records</span>
            </a>
            <a routerLink="/attendance" routerLinkActive="active">
              <i class="icon">📅</i><span>Attendance</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">Academics</span>
            <a routerLink="/academics" routerLinkActive="active">
              <i class="icon">📚</i><span>Courses</span>
            </a>
            <a routerLink="/exams" routerLinkActive="active">
              <i class="icon">✏️</i><span>Exams & Grades</span>
            </a>
            <a routerLink="/marks" routerLinkActive="active">
              <i class="icon">📄</i><span>Marks (Legacy)</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">Finance</span>
            <a routerLink="/finance" routerLinkActive="active">
              <i class="icon">💰</i><span>Fee Management</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">Campus</span>
            <a routerLink="/campus" routerLinkActive="active">
              <i class="icon">🏫</i><span>Campus & Hostel</span>
            </a>
            <a routerLink="/announcements" routerLinkActive="active">
              <i class="icon">📢</i><span>Announcements</span>
            </a>
            <a [routerLink]="['/chat', 'general']" routerLinkActive="active">
              <i class="icon">💬</i><span>Chat Rooms</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">Placement & Alumni</span>
            <a routerLink="/placements" routerLinkActive="active">
              <i class="icon">🧑‍💼</i><span>Placements</span>
            </a>
            <a routerLink="/alumni" routerLinkActive="active">
              <i class="icon">🎓</i><span>Alumni Network</span>
            </a>
          </div>

          <div class="nav-section">
            <span class="nav-label">Intelligence</span>
            <a routerLink="/analytics" routerLinkActive="active">
              <i class="icon">📈</i><span>Analytics & AI</span>
            </a>
          </div>
        </nav>

        <div class="logout-section">
          <button (click)="logout()">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <main class="main-content">
        <header class="top-bar">
          <div class="breadcrumb">Student Lifecycle Management System</div>
          <div class="user-info">
            <span class="online-dot"></span>
            <span>Admin Portal</span>
          </div>
        </header>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout-container { display:flex; height:100vh; overflow:hidden; font-family:'Inter',sans-serif; }

    /* Sidebar */
    .sidebar { width:240px; background:linear-gradient(180deg,#0f172a 0%,#1e293b 100%); color:#e2e8f0; display:flex; flex-direction:column; overflow-y:auto; scrollbar-width:thin; scrollbar-color:#334155 transparent; flex-shrink:0; }
    .sidebar::-webkit-scrollbar { width:4px; }
    .sidebar::-webkit-scrollbar-thumb { background:#334155; border-radius:4px; }

    /* Logo */
    .logo { padding:1.25rem 1rem; display:flex; align-items:center; gap:.75rem; border-bottom:1px solid #1e3a5f; }
    .logo-icon { font-size:1.8rem; }
    .logo-text h2 { margin:0; font-size:1.1rem; color:#f1f5f9; font-weight:800; letter-spacing:-.5px; }
    .logo-text span { font-size:.7rem; color:#64748b; font-weight:500; }

    /* Nav sections */
    nav { flex:1; padding:.5rem 0; }
    .nav-section { margin-bottom:.25rem; }
    .nav-label { display:block; padding:.5rem 1rem .25rem; font-size:.65rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#475569; }
    nav a { display:flex; align-items:center; padding:.55rem 1rem; color:#94a3b8; text-decoration:none; transition:all .2s; gap:.65rem; border-left:3px solid transparent; font-size:.88rem; font-weight:500; }
    nav a:hover { background:rgba(99,102,241,.1); color:#c7d2fe; border-left-color:#6366f1; }
    nav a.active { background:linear-gradient(90deg,rgba(99,102,241,.2),transparent); color:#a5b4fc; border-left-color:#818cf8; font-weight:600; }
    .icon { font-style:normal; font-size:1rem; width:18px; text-align:center; flex-shrink:0; }

    /* Logout */
    .logout-section { padding:.75rem; border-top:1px solid #1e3a5f; }
    .logout-section button { width:100%; padding:.55rem; background:rgba(239,68,68,.15); color:#fca5a5; border:1px solid rgba(239,68,68,.3); border-radius:8px; cursor:pointer; font-size:.88rem; font-weight:600; display:flex; align-items:center; justify-content:center; gap:.5rem; transition:all .2s; }
    .logout-section button:hover { background:rgba(239,68,68,.25); }

    /* Main content */
    .main-content { flex:1; display:flex; flex-direction:column; background:#f1f5f9; overflow:hidden; }
    .top-bar { background:#fff; padding:.75rem 1.5rem; box-shadow:0 1px 3px rgba(0,0,0,.08); display:flex; justify-content:space-between; align-items:center; flex-shrink:0; }
    .breadcrumb { font-size:.85rem; color:#64748b; font-weight:500; }
    .user-info { display:flex; align-items:center; gap:.5rem; font-size:.85rem; color:#374151; font-weight:500; }
    .online-dot { width:8px; height:8px; background:#10b981; border-radius:50%; display:inline-block; }
    .content-area { flex:1; overflow-y:auto; padding:1.5rem 2rem; }
    @media(max-width:768px) { .content-area { padding:1rem; } }
  `]
})
export class MainLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}
  logout() { this.authService.logout(); this.router.navigate(['/login']); }
}
