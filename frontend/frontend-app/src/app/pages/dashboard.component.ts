import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../services/student.service';
import { RiskService } from '../services/risk.service';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="header-section">
        <h1>Dashboard Protocol</h1>
        <div class="user-info" *ngIf="user">
          <span class="user-badge" [class.admin-badge]="isAdmin">
            {{ user.role }} Mode
          </span>
          <span class="user-name">{{ user.name }}</span>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card blue">
          <h3>Total Students</h3>
          <p class="number">{{ totalStudents }}</p>
          <span class="stat-footer">Across all departments</span>
        </div>
        
        <div class="stat-card purple" *ngIf="isAdmin">
          <h3>Total Alumni</h3>
          <p class="number">{{ totalAlumni }}</p>
          <span class="stat-footer">Registered graduates</span>
        </div>
        
        <div class="stat-card green">
          <h3>Average Attendance</h3>
          <p class="number">{{ averageAttendance }}%</p>
          <span class="stat-footer">Current semester avg</span>
        </div>
        
        <div class="stat-card red">
          <h3>At Risk Students</h3>
          <p class="number">{{ atRiskCount }}</p>
          <span class="stat-footer">Action required</span>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="recent-section">
          <h3>🚨 At Risk Students Attention Required</h3>
          <div class="table-container">
            <table *ngIf="atRiskStudents.length > 0; else noRisk">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Risk Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let student of atRiskStudents">
                  <td>{{ student.name }}</td>
                  <td><span class="badge" [class.warn]="student.riskStatus === 'High'" [class.danger]="student.riskStatus === 'Critical'">{{ student.riskStatus }}</span></td>
                  <td>Low Attendance / Poor Marks</td>
                </tr>
              </tbody>
            </table>
            <ng-template #noRisk>
              <p>No students currently at risk. Good job!</p>
            </ng-template>
          </div>
        </div>

        <div class="activity-section" *ngIf="isAdmin">
          <h3>💬 Recent Communication activity</h3>
          <div class="activity-list">
            <div *ngIf="recentChats.length > 0; else noActivity">
              <div class="activity-item" *ngFor="let chat of recentChats">
                <div class="activity-meta">
                  <span class="sender">{{ chat.senderName }}</span>
                  <span class="time">{{ chat.createdAt | date:'shortTime' }}</span>
                </div>
                <p class="message-preview">{{ chat.message }}</p>
                <span class="room-tag">Room: {{ chat.room }}</span>
              </div>
            </div>
            <ng-template #noActivity>
              <p>No recent activity found.</p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      animation: fadeIn 0.5s ease-out;
      padding: 1rem;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    h1 {
      color: #2c3e50;
      margin: 0;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .user-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      background: #ecf0f1;
      color: #7f8c8d;
    }
    .admin-badge {
      background: #e74c3c;
      color: white;
    }
    .user-name {
      color: #34495e;
      font-weight: 500;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-card .number {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0.5rem 0;
      color: #2c3e50;
    }
    .stat-footer {
      font-size: 0.75rem;
      color: #95a5a6;
    }
    .blue { border-bottom: 4px solid #3498db; }
    .purple { border-bottom: 4px solid #9b59b6; }
    .green { border-bottom: 4px solid #2ecc71; }
    .red { border-bottom: 4px solid #e74c3c; }
    
    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }
    @media (max-width: 992px) {
      .dashboard-content { grid-template-columns: 1fr; }
    }
    
    .recent-section, .activity-section {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    .table-container {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    th, td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #f1f4f5;
    }
    th {
      color: #95a5a6;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge {
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge.warn {
      background: #fdf2e9;
      color: #e67e22;
    }
    .badge.danger {
      background: #fde8e7;
      color: #e74c3c;
    }
    
    .activity-list {
      margin-top: 1rem;
    }
    .activity-item {
      padding: 1rem 0;
      border-bottom: 1px solid #f1f4f5;
    }
    .activity-item:last-child { border-bottom: none; }
    .activity-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.3rem;
    }
    .sender {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
    }
    .time {
      font-size: 0.75rem;
      color: #95a5a6;
    }
    .message-preview {
      margin: 0;
      color: #7f8c8d;
      font-size: 0.85rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .room-tag {
      font-size: 0.7rem;
      background: #f8f9fa;
      padding: 0.1rem 0.4rem;
      border-radius: 3px;
      color: #3498db;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalStudents = 0;
  totalAlumni = 0;
  averageAttendance = 0;
  atRiskCount = 0;
  atRiskStudents: any[] = [];
  recentChats: any[] = [];
  isAdmin = false;
  user: any = null;

  constructor(
    private studentService: StudentService,
    private riskService: RiskService,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.isAdmin = user?.role === 'Admin';
      this.loadData();
    });
  }

  loadData() {
    // Basic stats for everyone (or at least staff)
    this.studentService.getAllStudents().subscribe((data: any) => {
      this.totalStudents = data.length;
    });

    this.riskService.getAtRiskStudents().subscribe((data: any) => {
      this.atRiskStudents = data;
      this.atRiskCount = data.length;
    });

    // Admin specific stats
    if (this.isAdmin) {
      this.dashboardService.getAdminStats().subscribe((data: any) => {
        this.totalAlumni = data.totalAlumni;
        this.averageAttendance = data.averageAttendance;
        this.recentChats = data.recentChats;
      });
    }
  }
}
