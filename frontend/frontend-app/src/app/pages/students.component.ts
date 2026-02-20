import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="header">
        <h2>Student Management</h2>
        <button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? 'Cancel' : '+ Add Student' }}
        </button>
      </div>

      <!-- Add Student Form -->
      <div class="form-card" *ngIf="showForm">
        <h3>Add New Student</h3>
        <div class="form-row">
          <div class="form-group">
            <label>Student ID</label>
            <input type="text" [(ngModel)]="newStudent.studentId" placeholder="e.g. STU-001">
          </div>
          <div class="form-group">
            <label>Name *</label>
            <input type="text" [(ngModel)]="newStudent.name" placeholder="Enter student name">
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" [(ngModel)]="newStudent.email" placeholder="Enter student email">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Department</label>
            <select [(ngModel)]="newStudent.department">
              <option value="">-- Select Department --</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>
          <div class="form-group">
            <label>Current Semester</label>
            <select [(ngModel)]="newStudent.currentSemester">
              <option [ngValue]="null">-- Select Semester --</option>
              <option *ngFor="let sem of [1,2,3,4,5,6,7,8]" [ngValue]="sem">Semester {{ sem }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Lifecycle Stage</label>
            <select [(ngModel)]="newStudent.lifecycleStage">
              <option value="Admission">Admission</option>
              <option value="Academic">Academic</option>
              <option value="Placement">Placement</option>
              <option value="Alumni">Alumni</option>
            </select>
          </div>
        </div>
        <button class="btn-primary" (click)="addStudent()" [disabled]="!newStudent.name || !newStudent.email">
          Save Student
        </button>
        <p class="success-msg" *ngIf="successMessage">{{ successMessage }}</p>
        <p class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</p>
      </div>

      <!-- Loading Spinner -->
      <div class="loading" *ngIf="loading">
        <p>Loading students...</p>
      </div>

      <!-- Students Table -->
      <div class="table-card" *ngIf="!loading">
        <table *ngIf="students.length > 0; else noStudents">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Semester</th>
              <th>GPA</th>
              <th>Attendance</th>
              <th>Risk</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of students">
              <td>{{ s.studentId }}</td>
              <td>{{ s.name }}</td>
              <td>{{ s.email }}</td>
              <td>{{ s.department || 'N/A' }}</td>
              <td>{{ s.currentSemester || 'N/A' }}</td>
              <td>{{ s.gpa != null ? s.gpa : '--' }}</td>
              <td>
                <span class="badge" [class.good]="s.attendancePercentage >= 75" [class.warn]="s.attendancePercentage < 75">
                  {{ s.attendancePercentage != null ? (s.attendancePercentage | number:'1.0-0') + '%' : '--' }}
                </span>
              </td>
              <td>
                <span class="badge" [class.good]="s.riskStatus === 'Normal'" [class.warn]="s.riskStatus === 'At Risk'">
                  {{ s.riskStatus || 'Normal' }}
                </span>
              </td>
              <td>
                <button class="btn-delete" (click)="deleteStudent(s._id)" title="Delete student">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noStudents>
          <p class="empty-state">No students found. Add one to get started!</p>
        </ng-template>
      </div>

      <!-- Error display for API failures -->
      <p class="error-msg api-error" *ngIf="apiError">⚠️ {{ apiError }}</p>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 2rem;
    }
    h2 { color: #2c3e50; margin: 0; }

    .btn-primary {
      padding: 0.6rem 1.2rem; background: #3498db; color: white;
      border: none; border-radius: 6px; cursor: pointer; font-weight: 500;
    }
    .btn-primary:hover { background: #2980b9; }
    .btn-primary:disabled { background: #bdc3c7; cursor: not-allowed; }

    .form-card {
      background: white; padding: 1.5rem; border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 2rem;
    }
    .form-card h3 { margin-top: 0; color: #34495e; }

    .form-row {
      display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;
    }
    .form-group { flex: 1; min-width: 200px; }
    .form-group label { display: block; margin-bottom: 0.4rem; color: #7f8c8d; font-size: 0.9rem; }
    .form-group input, .form-group select {
      width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px;
      box-sizing: border-box; font-size: 0.95rem;
    }
    .form-group input:focus, .form-group select:focus { outline: none; border-color: #3498db; }

    .success-msg { color: #27ae60; margin-top: 0.5rem; }
    .error-msg { color: #e74c3c; margin-top: 0.5rem; }
    .api-error { padding: 1rem; background: #fde8e7; border-radius: 6px; margin-top: 1rem; }

    .loading { text-align: center; padding: 2rem; color: #7f8c8d; }

    .table-card {
      background: white; padding: 1.5rem; border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow-x: auto;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #ecf0f1; }
    th { color: #7f8c8d; font-weight: 500; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px; }

    .badge {
      padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.85rem; font-weight: 500;
    }
    .badge.good { background: #eafaf1; color: #27ae60; }
    .badge.warn { background: #fde8e7; color: #e74c3c; }

    .btn-delete {
      background: none; border: none; cursor: pointer; font-size: 1.1rem;
      padding: 0.3rem 0.5rem; border-radius: 4px;
    }
    .btn-delete:hover { background: #fde8e7; }

    .empty-state { text-align: center; color: #95a5a6; padding: 2rem; }
  `]
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  showForm = false;
  loading = true;
  newStudent: any = {
    studentId: '',
    name: '',
    email: '',
    department: '',
    currentSemester: null,
    lifecycleStage: 'Admission'
  };
  successMessage = '';
  errorMessage = '';
  apiError = '';

  constructor(private studentService: StudentService) { }

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.loading = true;
    this.apiError = '';
    this.studentService.getAllStudents().subscribe({
      next: (data: any) => {
        this.students = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Failed to load students:', err);
        this.loading = false;
        if (err.status === 401) {
          this.apiError = 'Authentication failed. Please log in again.';
        } else {
          this.apiError = 'Failed to load students: ' + (err.error?.message || err.message || 'Server error');
        }
      }
    });
  }

  addStudent() {
    this.successMessage = '';
    this.errorMessage = '';

    const studentData: any = {
      name: this.newStudent.name,
      email: this.newStudent.email
    };

    // Only include optional fields if provided
    if (this.newStudent.studentId) studentData.studentId = this.newStudent.studentId;
    if (this.newStudent.department) studentData.department = this.newStudent.department;
    if (this.newStudent.currentSemester) studentData.currentSemester = this.newStudent.currentSemester;
    if (this.newStudent.lifecycleStage) studentData.lifecycleStage = this.newStudent.lifecycleStage;

    this.studentService.createStudent(studentData).subscribe({
      next: (res: any) => {
        this.successMessage = 'Student added successfully!';
        this.newStudent = {
          studentId: '',
          name: '',
          email: '',
          department: '',
          currentSemester: null,
          lifecycleStage: 'Admission'
        };
        this.loadStudents();
        setTimeout(() => {
          this.successMessage = '';
          this.showForm = false;
        }, 1500);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Failed to add student.';
      }
    });
  }

  deleteStudent(id: string) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.loadStudents();
      },
      error: (err: any) => {
        this.apiError = 'Failed to delete student: ' + (err.error?.message || err.message);
      }
    });
  }
}
