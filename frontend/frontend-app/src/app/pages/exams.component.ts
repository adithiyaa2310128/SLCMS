import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExamService } from '../services/exam.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h2>Exams & Marks</h2><p class="subtitle">Results, grades & CGPA computation</p></div>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? '✕ Cancel' : '+ Add Result' }}</button>
      </div>

      <!-- Add Result Form -->
      <div class="card form-card" *ngIf="showForm">
        <h3>Add Exam Result</h3>
        <div class="form-grid">
          <div class="fg"><label>Student *</label>
            <select [(ngModel)]="form.studentId" (ngModelChange)="onStudentChange()">
              <option value="">-- Select Student --</option>
              <option *ngFor="let s of students" [value]="s.studentId">{{ s.name }} ({{ s.studentId }})</option>
            </select>
          </div>
          <div class="fg"><label>Course Code *</label><input [(ngModel)]="form.courseCode" placeholder="e.g. CS301"></div>
          <div class="fg"><label>Course Name</label><input [(ngModel)]="form.courseName" placeholder="Data Structures"></div>
          <div class="fg"><label>Exam Type</label>
            <select [(ngModel)]="form.type">
              <option *ngFor="let t of examTypes" [value]="t">{{ t }}</option>
            </select>
          </div>
          <div class="fg"><label>Semester</label>
            <select [(ngModel)]="form.semester">
              <option *ngFor="let s of [1,2,3,4,5,6,7,8]" [value]="s">Semester {{ s }}</option>
            </select>
          </div>
          <div class="fg"><label>Max Marks</label><input type="number" [(ngModel)]="form.maxMarks" min="1"></div>
          <div class="fg"><label>Obtained Marks</label><input type="number" [(ngModel)]="form.obtainedMarks" min="0"></div>
          <div class="fg"><label>Exam Date</label><input type="date" [(ngModel)]="form.examDate"></div>
        </div>
        <div class="grade-preview" *ngIf="form.maxMarks && form.obtainedMarks !== ''">
          <span>Preview Grade: </span>
          <span class="grade-badge" [ngClass]="gradeClass(calcGrade())">{{ calcGrade() }}</span>
          <span class="pct"> ({{ calcPct() }}%)</span>
        </div>
        <div class="form-actions" style="margin-top:1rem">
          <button class="btn-primary" (click)="save()" [disabled]="!form.studentId || !form.courseCode">Save Result</button>
          <span class="success" *ngIf="msg">{{ msg }}</span>
          <span class="error" *ngIf="err">{{ err }}</span>
        </div>
      </div>

      <!-- Filter -->
      <div class="filter-bar">
        <select [(ngModel)]="filterStudent" (ngModelChange)="applyFilter()">
          <option value="">All Students</option>
          <option *ngFor="let s of students" [value]="s.studentId">{{ s.name }}</option>
        </select>
        <select [(ngModel)]="filterType" (ngModelChange)="applyFilter()">
          <option value="">All Types</option>
          <option *ngFor="let t of examTypes" [value]="t">{{ t }}</option>
        </select>
        <input [(ngModel)]="search" placeholder="🔍 Search course..." (input)="applyFilter()">
      </div>

      <!-- Table -->
      <div class="card table-card">
        <div class="loading" *ngIf="loading">Loading...</div>
        <table *ngIf="!loading && filtered.length > 0">
          <thead>
            <tr><th>Student</th><th>Course</th><th>Type</th><th>Sem</th><th>Marks</th><th>Grade</th><th>Points</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of filtered">
              <td>{{ e.studentName || e.studentId }}</td>
              <td><strong>{{ e.courseCode }}</strong><br><small>{{ e.courseName }}</small></td>
              <td><span class="type-badge">{{ e.type }}</span></td>
              <td>{{ e.semester }}</td>
              <td>{{ e.obtainedMarks }}/{{ e.maxMarks }}</td>
              <td><span class="grade-badge" [ngClass]="gradeClass(e.grade)">{{ e.grade }}</span></td>
              <td><strong>{{ e.gradePoints }}</strong></td>
              <td>{{ e.examDate ? (e.examDate | date:'dd MMM yy') : '—' }}</td>
              <td><button class="btn-icon danger" (click)="delete(e._id)">🗑️</button></td>
            </tr>
          </tbody>
        </table>
        <p class="empty" *ngIf="!loading && filtered.length === 0">No exam records found.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { animation: fadeIn .4s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; }
    .page-header h2 { margin:0; font-size:1.6rem; color:#1e293b; }
    .subtitle { color:#64748b; margin:.25rem 0 0; font-size:.9rem; }
    .btn-primary { padding:.6rem 1.4rem; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 4px 15px rgba(99,102,241,.4); }
    .btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }

    .card { background:#fff; border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .form-card { padding:1.5rem; margin-bottom:1.5rem; }
    .form-card h3 { margin:0 0 1rem; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:1rem; }
    .fg label { display:block; font-size:.82rem; color:#64748b; margin-bottom:.35rem; font-weight:500; }
    .fg input,.fg select { width:100%; padding:.55rem .75rem; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; box-sizing:border-box; }
    .fg input:focus,.fg select:focus { outline:none; border-color:#6366f1; }
    .form-actions { display:flex; align-items:center; gap:1rem; }
    .success{color:#10b981} .error{color:#ef4444}
    .grade-preview { margin-top:1rem; display:flex; align-items:center; gap:.5rem; }
    .pct { color:#64748b; font-size:.9rem; }

    .filter-bar { display:flex; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; }
    .filter-bar select,.filter-bar input { padding:.55rem .8rem; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; }
    .filter-bar input { flex:1; }

    .table-card { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:.8rem 1rem; font-size:.78rem; text-transform:uppercase; letter-spacing:.5px; color:#64748b; font-weight:600; text-align:left; }
    td { padding:.85rem 1rem; border-bottom:1px solid #f1f5f9; font-size:.88rem; }
    tr:hover td { background:#fafbff; }
    small { color:#94a3b8; font-size:.78rem; }

    .grade-badge { padding:.2rem .6rem; border-radius:6px; font-weight:700; font-size:.82rem; }
    .grade-O { background:#ecfdf5; color:#059669; }
    .grade-Ap { background:#f0fdf4; color:#16a34a; }
    .grade-A { background:#f0fdf4; color:#22c55e; }
    .grade-Bp { background:#fefce8; color:#ca8a04; }
    .grade-B { background:#fef9c3; color:#a16207; }
    .grade-C { background:#fff7ed; color:#ea580c; }
    .grade-F { background:#fef2f2; color:#dc2626; }

    .type-badge { background:#f0f9ff; color:#0369a1; padding:.2rem .5rem; border-radius:4px; font-size:.78rem; font-weight:600; }
    .btn-icon { background:none; border:none; cursor:pointer; padding:.3rem; border-radius:6px; }
    .btn-icon.danger:hover { background:#fee2e2; }
    .loading { padding:2rem; text-align:center; color:#64748b; }
    .empty { padding:2rem; text-align:center; color:#94a3b8; }
  `]
})
export class ExamsComponent implements OnInit {
  exams: any[] = [];
  filtered: any[] = [];
  students: any[] = [];
  loading = true;
  showForm = false;
  search = ''; filterStudent = ''; filterType = '';
  msg = ''; err = '';
  examTypes = ['Internal-1', 'Internal-2', 'Mid-Sem', 'End-Sem', 'Practical', 'Assignment'];
  form: any = { studentId:'', studentName:'', courseCode:'', courseName:'', type:'Internal-1', semester:1, maxMarks:100, obtainedMarks:'', examDate:'' };

  constructor(private examService: ExamService, private studentService: StudentService) {}
  ngOnInit() { this.load(); this.loadStudents(); }

  load() {
    this.loading = true;
    this.examService.getAll().subscribe({ next: d => { this.exams = d; this.applyFilter(); this.loading = false; }, error: () => this.loading = false });
  }

  loadStudents() { this.studentService.getAllStudents().subscribe((d: any) => this.students = d); }

  onStudentChange() {
    const s = this.students.find(x => x.studentId === this.form.studentId);
    if (s) { this.form.studentName = s.name; this.form.department = s.department; }
  }

  applyFilter() {
    let list = this.exams;
    if (this.filterStudent) list = list.filter(e => e.studentId === this.filterStudent);
    if (this.filterType) list = list.filter(e => e.type === this.filterType);
    if (this.search) { const q = this.search.toLowerCase(); list = list.filter(e => e.courseCode?.toLowerCase().includes(q) || e.courseName?.toLowerCase().includes(q)); }
    this.filtered = list;
  }

  calcPct() { return this.form.maxMarks > 0 ? Math.round((this.form.obtainedMarks / this.form.maxMarks) * 100) : 0; }
  calcGrade() {
    const p = this.calcPct();
    if (p >= 90) return 'O'; if (p >= 80) return 'A+'; if (p >= 70) return 'A';
    if (p >= 60) return 'B+'; if (p >= 50) return 'B'; if (p >= 40) return 'C'; return 'F';
  }
  gradeClass(g: string) {
    const m: any = { O:'grade-O', 'A+':'grade-Ap', A:'grade-A', 'B+':'grade-Bp', B:'grade-B', C:'grade-C', F:'grade-F' };
    return m[g] || '';
  }

  save() {
    this.msg = ''; this.err = '';
    this.examService.addResult(this.form).subscribe({
      next: () => { this.msg = '✅ Result saved!'; this.form = { studentId:'',studentName:'',courseCode:'',courseName:'',type:'Internal-1',semester:1,maxMarks:100,obtainedMarks:'',examDate:'' }; this.load(); setTimeout(() => { this.msg=''; this.showForm=false; }, 1500); },
      error: e => this.err = e.error?.message || 'Failed'
    });
  }

  delete(id: string) {
    if (!confirm('Delete this result?')) return;
    this.examService.delete(id).subscribe(() => this.load());
  }
}
