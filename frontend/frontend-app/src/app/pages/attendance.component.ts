import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { AttendanceService } from '../services/attendance.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <h2>Attendance Management</h2>

      <!-- Mark Attendance Section -->
      <div class="form-card">
        <h3>Mark Attendance</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Student</label>
            <select [(ngModel)]="selectedStudentId" (change)="onStudentChange()">
              <option value="">-- Select Student --</option>
              <option *ngFor="let s of students" [value]="s._id">{{ s.name }} ({{ s.studentId }})</option>
            </select>
          </div>
          <div class="form-group">
            <label>Subject</label>
            <input type="text" [(ngModel)]="subject" placeholder="e.g. Mathematics">
          </div>
          <div class="form-group">
            <label>Date</label>
            <input type="date" [(ngModel)]="attendanceDate">
          </div>
          <div class="form-group btn-group">
            <button class="btn present" (click)="markAttendance('Present')"
                    [disabled]="!selectedStudentId || !subject">
              ✅ Present
            </button>
            <button class="btn absent" (click)="markAttendance('Absent')"
                    [disabled]="!selectedStudentId || !subject">
              ❌ Absent
            </button>
          </div>
        </div>
        <p class="success-msg" *ngIf="statusMessage">{{ statusMessage }}</p>
        <p class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</p>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="loadingStudents">
        <p>Loading students...</p>
      </div>

      <!-- No Students Warning -->
      <div class="warning-card" *ngIf="!loadingStudents && students.length === 0">
        <p>⚠️ No students found. Please add students first from the Students page.</p>
      </div>

      <!-- Attendance Stats & History -->
      <div class="stats-row" *ngIf="selectedStudentId">
        <div class="stat-card">
          <h4>Attendance Percentage</h4>
          <p class="percentage" [class.good]="attendancePercentage >= 75" [class.warn]="attendancePercentage < 75">
            {{ attendancePercentage }}%
          </p>
        </div>
        <div class="stat-card">
          <h4>Total Records</h4>
          <p class="percentage">{{ attendanceRecords.length }}</p>
        </div>
        <div class="stat-card">
          <h4>Present</h4>
          <p class="percentage good">{{ presentCount }}</p>
        </div>
        <div class="stat-card">
          <h4>Absent</h4>
          <p class="percentage warn">{{ absentCount }}</p>
        </div>
      </div>

      <div class="table-card" *ngIf="selectedStudentId && attendanceRecords.length > 0">
        <h3>Attendance History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of attendanceRecords">
              <td>{{ record.date | date:'mediumDate' }}</td>
              <td>{{ record.subject }}</td>
              <td>
                <span class="badge" [class.present]="record.status === 'Present'" [class.absent]="record.status === 'Absent'">
                  {{ record.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-history" *ngIf="selectedStudentId && attendanceRecords.length === 0 && !loadingAttendance">
        <p>No attendance records yet for this student.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    h2 { color: #2c3e50; margin-bottom: 2rem; }

    .form-card {
      background: white; padding: 1.5rem; border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 2rem;
    }
    .form-card h3 { margin-top: 0; color: #34495e; }

    .form-row {
      display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;
    }
    .form-group { flex: 1; min-width: 180px; }
    .form-group label { display: block; margin-bottom: 0.4rem; color: #7f8c8d; font-size: 0.9rem; }
    .form-group select, .form-group input {
      width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px;
      box-sizing: border-box; font-size: 0.95rem;
    }
    .form-group select:focus, .form-group input:focus { outline: none; border-color: #3498db; }

    .btn-group { display: flex; gap: 0.5rem; flex: 0 0 auto; }
    .btn {
      padding: 0.6rem 1.2rem; border: none; border-radius: 6px; cursor: pointer;
      font-weight: 500; font-size: 0.95rem; color: white;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn.present { background: #27ae60; }
    .btn.present:hover:not(:disabled) { background: #219a52; }
    .btn.absent { background: #e74c3c; }
    .btn.absent:hover:not(:disabled) { background: #c0392b; }

    .success-msg { color: #27ae60; margin-top: 0.75rem; }
    .error-msg { color: #e74c3c; margin-top: 0.75rem; }

    .loading { text-align: center; padding: 2rem; color: #7f8c8d; }

    .warning-card {
      background: #fef9e7; padding: 1rem 1.5rem; border-radius: 10px;
      border-left: 4px solid #f39c12; margin-bottom: 2rem;
    }
    .warning-card p { margin: 0; color: #7d6608; }

    .stats-row {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem; margin-bottom: 2rem;
    }
    .stat-card {
      background: white; padding: 1.5rem; border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;
    }
    .stat-card h4 { margin: 0 0 0.5rem; color: #7f8c8d; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .percentage { font-size: 2rem; font-weight: bold; margin: 0; color: #2c3e50; }
    .percentage.good { color: #27ae60; }
    .percentage.warn { color: #e74c3c; }

    .table-card {
      background: white; padding: 1.5rem; border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow-x: auto;
    }
    .table-card h3 { margin-top: 0; color: #34495e; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #ecf0f1; }
    th { color: #7f8c8d; font-weight: 500; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; }

    .badge {
      padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.85rem; font-weight: 500;
    }
    .badge.present { background: #eafaf1; color: #27ae60; }
    .badge.absent { background: #fde8e7; color: #e74c3c; }

    .empty-history { text-align: center; padding: 2rem; color: #95a5a6; }
  `]
})
export class AttendanceComponent implements OnInit {
  students: any[] = [];
  selectedStudentId = '';
  subject = '';
  attendanceDate = '';
  attendanceRecords: any[] = [];
  attendancePercentage = 0;
  presentCount = 0;
  absentCount = 0;
  statusMessage = '';
  errorMessage = '';
  loadingStudents = true;
  loadingAttendance = false;

  constructor(
    private studentService: StudentService,
    private attendanceService: AttendanceService
  ) { }

  ngOnInit() {
    // Set today's date as default
    const today = new Date();
    this.attendanceDate = today.toISOString().split('T')[0];

    this.studentService.getAllStudents().subscribe({
      next: (data: any) => {
        this.students = data;
        this.loadingStudents = false;
      },
      error: (err: any) => {
        console.error('Failed to load students:', err);
        this.loadingStudents = false;
      }
    });
  }

  onStudentChange() {
    if (this.selectedStudentId) {
      this.loadAttendance();
    } else {
      this.attendanceRecords = [];
      this.attendancePercentage = 0;
      this.presentCount = 0;
      this.absentCount = 0;
    }
  }

  loadAttendance() {
    this.loadingAttendance = true;
    this.attendanceService.getAttendance(this.selectedStudentId).subscribe({
      next: (data: any) => {
        this.attendanceRecords = data.attendance || [];
        this.attendancePercentage = data.attendancePercentage || 0;
        this.presentCount = this.attendanceRecords.filter((r: any) => r.status === 'Present').length;
        this.absentCount = this.attendanceRecords.filter((r: any) => r.status === 'Absent').length;
        this.loadingAttendance = false;
      },
      error: (err: any) => {
        console.error('Failed to load attendance:', err);
        this.loadingAttendance = false;
        this.errorMessage = 'Failed to load attendance records.';
      }
    });
  }

  markAttendance(status: 'Present' | 'Absent') {
    this.statusMessage = '';
    this.errorMessage = '';

    this.attendanceService.markAttendance(
      this.selectedStudentId, status, this.subject, this.attendanceDate
    ).subscribe({
      next: (res: any) => {
        this.statusMessage = `Attendance marked as ${status}! (${res.attendancePercentage?.toFixed(0)}%)`;
        this.loadAttendance();
        setTimeout(() => { this.statusMessage = ''; }, 3000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to mark attendance.';
      }
    });
  }
}
