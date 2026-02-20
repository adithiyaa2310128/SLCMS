import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../services/student.service';
import { MarksService } from '../services/marks.service';

@Component({
  selector: 'app-marks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <h2>Marks Management</h2>

      <!-- Add Marks Section -->
      <div class="form-card">
        <h3>Add Marks</h3>
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
            <label>Marks (out of 100)</label>
            <input type="number" [(ngModel)]="marks" placeholder="e.g. 85" min="0" max="100">
          </div>
          <div class="form-group btn-group">
            <button class="btn-primary" (click)="submitMarks()"
                    [disabled]="!selectedStudentId || !subject || marks == null">
              💾 Save
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

      <!-- Stats -->
      <div class="stats-row" *ngIf="selectedStudentId && gpa != null">
        <div class="stat-card">
          <h4>Current GPA</h4>
          <p class="gpa-value">{{ gpa }}</p>
        </div>
        <div class="stat-card">
          <h4>Total Subjects</h4>
          <p class="gpa-value">{{ marksHistory.length }}</p>
        </div>
        <div class="stat-card">
          <h4>Average Marks</h4>
          <p class="gpa-value">{{ averageMarks }}</p>
        </div>
      </div>

      <!-- Marks History -->
      <div class="table-card" *ngIf="selectedStudentId && marksHistory.length > 0">
        <h3>Marks History</h3>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let m of marksHistory">
              <td>{{ m.subject }}</td>
              <td>
                <span class="badge" [class.good]="m.marks >= 50" [class.warn]="m.marks < 50">
                  {{ m.marks }}
                </span>
              </td>
              <td>{{ getGrade(m.marks) }}</td>
              <td>{{ m.createdAt | date:'mediumDate' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-history" *ngIf="selectedStudentId && marksHistory.length === 0 && !loadingMarks">
        <p>No marks records yet for this student.</p>
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

    .btn-group { flex: 0 0 auto; display: flex; align-items: flex-end; }
    .btn-primary {
      padding: 0.6rem 1.2rem; background: #3498db; color: white;
      border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 0.95rem;
    }
    .btn-primary:hover { background: #2980b9; }
    .btn-primary:disabled { background: #bdc3c7; cursor: not-allowed; }

    .success-msg { color: #27ae60; margin-top: 0.75rem; }
    .error-msg { color: #e74c3c; margin-top: 0.75rem; }

    .loading { text-align: center; padding: 2rem; color: #7f8c8d; }

    .warning-card {
      background: #fef9e7; padding: 1rem 1.5rem; border-radius: 10px;
      border-left: 4px solid #f39c12; margin-bottom: 2rem;
    }
    .warning-card p { margin: 0; color: #7d6608; }

    .stats-row {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem; margin-bottom: 2rem;
    }
    .stat-card {
      background: white; padding: 1.5rem; border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;
    }
    .stat-card h4 { margin: 0 0 0.5rem; color: #7f8c8d; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .gpa-value { font-size: 2rem; font-weight: bold; margin: 0; color: #3498db; }

    .table-card {
      background: white; padding: 1.5rem; border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow-x: auto;
    }
    .table-card h3 { margin-top: 0; color: #34495e; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #ecf0f1; }
    th { color: #7f8c8d; font-weight: 500; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; }

    .badge {
      padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.85rem; font-weight: 500;
    }
    .badge.good { background: #eafaf1; color: #27ae60; }
    .badge.warn { background: #fde8e7; color: #e74c3c; }

    .empty-history { text-align: center; padding: 2rem; color: #95a5a6; }
  `]
})
export class MarksComponent implements OnInit {
  students: any[] = [];
  selectedStudentId = '';
  subject = '';
  marks: number | null = null;
  marksHistory: any[] = [];
  gpa: number | null = null;
  averageMarks: number | null = null;
  statusMessage = '';
  errorMessage = '';
  loadingStudents = true;
  loadingMarks = false;

  constructor(
    private studentService: StudentService,
    private marksService: MarksService
  ) { }

  ngOnInit() {
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
      this.loadMarks();
    } else {
      this.marksHistory = [];
      this.gpa = null;
      this.averageMarks = null;
    }
  }

  loadMarks() {
    this.loadingMarks = true;
    this.marksService.getMarksByStudent(this.selectedStudentId).subscribe({
      next: (data: any) => {
        this.marksHistory = data;
        if (data.length > 0) {
          const total = data.reduce((sum: number, m: any) => sum + m.marks, 0);
          const avg = total / data.length;
          this.averageMarks = Math.round(avg * 10) / 10;
          this.gpa = Math.round((avg / 10) * 10) / 10;
        } else {
          this.gpa = null;
          this.averageMarks = null;
        }
        this.loadingMarks = false;
      },
      error: (err: any) => {
        console.error('Failed to load marks:', err);
        this.loadingMarks = false;
        this.errorMessage = 'Failed to load marks records.';
      }
    });
  }

  submitMarks() {
    this.statusMessage = '';
    this.errorMessage = '';

    this.marksService.addMarks({
      studentId: this.selectedStudentId,
      subject: this.subject,
      marks: this.marks
    }).subscribe({
      next: (res: any) => {
        this.statusMessage = `Marks saved! GPA: ${res.gpa}`;
        this.subject = '';
        this.marks = null;
        this.gpa = res.gpa;
        this.loadMarks();
        setTimeout(() => { this.statusMessage = ''; }, 3000);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to save marks.';
      }
    });
  }

  getGrade(marks: number): string {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
  }
}
