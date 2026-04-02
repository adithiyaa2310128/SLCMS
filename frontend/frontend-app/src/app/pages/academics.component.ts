import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-academics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h2>Academic Management</h2><p class="subtitle">Courses, curriculum & timetable</p></div>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? '✕ Cancel' : '+ Add Course' }}</button>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <select [(ngModel)]="filterDept" (ngModelChange)="load()">
          <option value="">All Departments</option>
          <option *ngFor="let d of departments" [value]="d">{{ d }}</option>
        </select>
        <select [(ngModel)]="filterSem" (ngModelChange)="load()">
          <option value="">All Semesters</option>
          <option *ngFor="let s of [1,2,3,4,5,6,7,8]" [value]="s">Semester {{ s }}</option>
        </select>
        <input [(ngModel)]="search" placeholder="🔍 Search courses..." (input)="applySearch()">
      </div>

      <!-- Add Form -->
      <div class="card form-card" *ngIf="showForm">
        <h3>Add New Course</h3>
        <div class="form-grid">
          <div class="fg"><label>Course Code *</label><input [(ngModel)]="form.courseCode" placeholder="e.g. CS301"></div>
          <div class="fg"><label>Title *</label><input [(ngModel)]="form.title" placeholder="Data Structures"></div>
          <div class="fg"><label>Department *</label>
            <select [(ngModel)]="form.department">
              <option value="">-- Select --</option>
              <option *ngFor="let d of departments" [value]="d">{{ d }}</option>
            </select>
          </div>
          <div class="fg"><label>Credits</label><input type="number" [(ngModel)]="form.credits" min="1" max="6"></div>
          <div class="fg"><label>Semester</label>
            <select [(ngModel)]="form.semester">
              <option *ngFor="let s of [1,2,3,4,5,6,7,8]" [value]="s">Semester {{ s }}</option>
            </select>
          </div>
          <div class="fg"><label>Faculty Name</label><input [(ngModel)]="form.facultyName" placeholder="Dr. Smith"></div>
          <div class="fg"><label>Faculty Email</label><input type="email" [(ngModel)]="form.facultyEmail" placeholder="faculty@college.edu"></div>
          <div class="fg"><label>Max Students</label><input type="number" [(ngModel)]="form.maxStudents" placeholder="60"></div>
        </div>
        <div class="fg full"><label>Description</label><input [(ngModel)]="form.description" placeholder="Brief course description"></div>
        <div class="form-actions" style="margin-top:1rem">
          <button class="btn-primary" (click)="save()" [disabled]="!form.courseCode || !form.title || !form.department">Save Course</button>
          <span class="success" *ngIf="msg">{{ msg }}</span>
          <span class="error" *ngIf="err">{{ err }}</span>
        </div>
      </div>

      <!-- Course Grid -->
      <div class="course-grid" *ngIf="!loading">
        <div class="course-card" *ngFor="let c of filtered">
          <div class="card-top">
            <div class="code-badge">{{ c.courseCode }}</div>
            <div class="sem-badge">Sem {{ c.semester }}</div>
          </div>
          <h4>{{ c.title }}</h4>
          <p class="dept-tag">{{ c.department }}</p>
          <div class="meta-row">
            <span>📚 {{ c.credits }} Credits</span>
            <span>👤 {{ c.enrolledCount || 0 }}/{{ c.maxStudents }} Students</span>
          </div>
          <div class="faculty-row" *ngIf="c.facultyName">
            <span>🎓 {{ c.facultyName }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width]="((c.enrolledCount||0)/c.maxStudents*100) + '%'"></div>
          </div>
          <div class="card-actions">
            <button class="btn-del" (click)="delete(c._id)" title="Delete">🗑️</button>
          </div>
        </div>
      </div>
      <div class="loading" *ngIf="loading">Loading courses...</div>
      <p class="empty" *ngIf="!loading && filtered.length === 0">No courses found. Add one to get started!</p>
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

    .filter-bar { display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap; }
    .filter-bar select,.filter-bar input { padding:.55rem .8rem; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; }
    .filter-bar input { flex:1; }

    .card { background:#fff; border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .form-card { padding:1.5rem; margin-bottom:1.5rem; }
    .form-card h3 { margin:0 0 1rem; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:1rem; margin-bottom:.5rem; }
    .fg label { display:block; font-size:.82rem; color:#64748b; margin-bottom:.35rem; font-weight:500; }
    .fg input,.fg select { width:100%; padding:.55rem .75rem; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; box-sizing:border-box; }
    .fg input:focus,.fg select:focus { outline:none; border-color:#6366f1; }
    .fg.full { margin-top:.5rem; }
    .form-actions { display:flex; align-items:center; gap:1rem; }
    .success{color:#10b981} .error{color:#ef4444}

    .course-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.25rem; }
    .course-card { background:#fff; border-radius:14px; padding:1.25rem; box-shadow:0 2px 12px rgba(0,0,0,.07); transition:all .2s; border:1px solid #f1f5f9; }
    .course-card:hover { transform:translateY(-4px); box-shadow:0 8px 25px rgba(0,0,0,.12); }
    .card-top { display:flex; justify-content:space-between; margin-bottom:.75rem; }
    .code-badge { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; padding:.25rem .65rem; border-radius:6px; font-size:.8rem; font-weight:700; }
    .sem-badge { background:#f0fdf4; color:#16a34a; padding:.25rem .65rem; border-radius:6px; font-size:.8rem; font-weight:600; }
    .course-card h4 { margin:0 0 .25rem; font-size:1rem; color:#1e293b; }
    .dept-tag { margin:0 0 .75rem; color:#8b5cf6; font-size:.82rem; font-weight:500; }
    .meta-row { display:flex; gap:1rem; font-size:.82rem; color:#64748b; margin-bottom:.5rem; }
    .faculty-row { font-size:.82rem; color:#374151; margin-bottom:.75rem; }
    .progress-bar { background:#f1f5f9; border-radius:4px; height:6px; overflow:hidden; margin-bottom:.75rem; }
    .progress-fill { height:100%; background:linear-gradient(90deg,#6366f1,#8b5cf6); border-radius:4px; transition:width .3s; }
    .card-actions { display:flex; justify-content:flex-end; }
    .btn-del { background:none; border:none; cursor:pointer; padding:.3rem; border-radius:6px; }
    .btn-del:hover { background:#fee2e2; }
    .loading { padding:3rem; text-align:center; color:#64748b; }
    .empty { padding:3rem; text-align:center; color:#94a3b8; }
  `]
})
export class AcademicsComponent implements OnInit {
  courses: any[] = [];
  filtered: any[] = [];
  loading = true;
  showForm = false;
  search = ''; filterDept = ''; filterSem: any = '';
  msg = ''; err = '';

  departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'];
  form: any = { courseCode:'', title:'', department:'', credits:3, semester:1, facultyName:'', facultyEmail:'', maxStudents:60, description:'' };

  constructor(private courseService: CourseService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.filterDept) params.department = this.filterDept;
    if (this.filterSem) params.semester = this.filterSem;
    this.courseService.getAll(params).subscribe({
      next: d => { this.courses = d; this.applySearch(); this.loading = false; },
      error: () => this.loading = false
    });
  }

  applySearch() {
    if (!this.search) { this.filtered = this.courses; return; }
    const q = this.search.toLowerCase();
    this.filtered = this.courses.filter(c => c.title?.toLowerCase().includes(q) || c.courseCode?.toLowerCase().includes(q));
  }

  save() {
    this.msg = ''; this.err = '';
    this.courseService.create(this.form).subscribe({
      next: () => { this.msg = '✅ Course added!'; this.form = { courseCode:'',title:'',department:'',credits:3,semester:1,facultyName:'',facultyEmail:'',maxStudents:60,description:'' }; this.load(); setTimeout(() => { this.msg=''; this.showForm=false; }, 1500); },
      error: e => this.err = e.error?.message || 'Failed'
    });
  }

  delete(id: string) {
    if (!confirm('Delete this course?')) return;
    this.courseService.delete(id).subscribe(() => this.load());
  }
}
