import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlacementService } from '../services/placement.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-placements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h2>Placement & Career Services</h2><p class="subtitle">Drive tracking, offers & CTC analytics</p></div>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? '✕ Cancel' : '+ Add Placement' }}</button>
      </div>

      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card"><div class="stat-icon">🏢</div><span class="stat-val">{{ stats.totalDrives }}</span><span class="stat-lbl">Companies</span></div>
        <div class="stat-card"><div class="stat-icon">🎯</div><span class="stat-val">{{ stats.studentsPlaced }}</span><span class="stat-lbl">Students Placed</span></div>
        <div class="stat-card highlight"><div class="stat-icon">📈</div><span class="stat-val">{{ stats.placementRate }}%</span><span class="stat-lbl">Placement Rate</span></div>
        <div class="stat-card"><div class="stat-icon">💰</div><span class="stat-val">{{ stats.avgCTC }} LPA</span><span class="stat-lbl">Avg CTC</span></div>
        <div class="stat-card"><div class="stat-icon">📋</div><span class="stat-val">{{ stats.totalOffers }}</span><span class="stat-lbl">Total Offers</span></div>
      </div>

      <div class="card form-card" *ngIf="showForm">
        <h3>Add Placement Record</h3>
        <div class="form-grid">
          <div class="fg"><label>Student *</label>
            <select [(ngModel)]="form.studentId" (change)="onStudentChange()">
              <option value="">-- Select --</option>
              <option *ngFor="let s of students" [value]="s.studentId">{{ s.name }} ({{ s.studentId }})</option>
            </select>
          </div>
          <div class="fg"><label>Company *</label><input [(ngModel)]="form.companyName" placeholder="Google, TCS..."></div>
          <div class="fg"><label>Role *</label><input [(ngModel)]="form.role" placeholder="Software Engineer"></div>
          <div class="fg"><label>Type</label>
            <select [(ngModel)]="form.type">
              <option *ngFor="let t of types" [value]="t">{{ t }}</option>
            </select>
          </div>
          <div class="fg"><label>CTC (LPA)</label><input type="number" [(ngModel)]="form.ctc" placeholder="12"></div>
          <div class="fg"><label>Stipend (₹/mo)</label><input type="number" [(ngModel)]="form.stipend" placeholder="25000"></div>
          <div class="fg"><label>Location</label><input [(ngModel)]="form.location" placeholder="Bangalore"></div>
          <div class="fg"><label>Drive Date</label><input type="date" [(ngModel)]="form.driveDate"></div>
          <div class="fg"><label>Status</label>
            <select [(ngModel)]="form.status">
              <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
            </select>
          </div>
        </div>
        <div class="form-actions" style="margin-top:1rem">
          <button class="btn-primary" (click)="save()" [disabled]="!form.studentId || !form.companyName || !form.role">Save</button>
          <span class="success" *ngIf="msg">{{ msg }}</span>
          <span class="error" *ngIf="err">{{ err }}</span>
        </div>
      </div>

      <div class="filter-bar">
        <select [(ngModel)]="filterStatus" (change)="applyFilter()">
          <option value="">All Statuses</option>
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
        <select [(ngModel)]="filterType" (change)="applyFilter()">
          <option value="">All Types</option>
          <option *ngFor="let t of types" [value]="t">{{ t }}</option>
        </select>
        <input [(ngModel)]="search" placeholder="🔍 Search company or student..." (input)="applyFilter()">
      </div>

      <div class="card table-card">
        <div class="loading" *ngIf="loading">Loading...</div>
        <table *ngIf="!loading && filtered.length > 0">
          <thead><tr><th>Student</th><th>Company</th><th>Role</th><th>Type</th><th>CTC/Stipend</th><th>Drive Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let p of filtered">
              <td><strong>{{ p.studentName || p.studentId }}</strong></td>
              <td><strong>{{ p.companyName }}</strong></td>
              <td>{{ p.role }}</td>
              <td><span class="type-badge" [ngClass]="p.type === 'Full-Time' ? 'ft' : 'intern'">{{ p.type }}</span></td>
              <td>
                <span *ngIf="p.type === 'Full-Time' && p.ctc">💰 {{ p.ctc }} LPA</span>
                <span *ngIf="p.stipend && p.type === 'Internship'">₹{{ p.stipend | number }}/mo</span>
                <span *ngIf="!p.ctc && !p.stipend">—</span>
              </td>
              <td>{{ p.driveDate ? (p.driveDate | date:'dd MMM') : '—' }}</td>
              <td>
                <select class="status-select" [value]="p.status" (change)="updateStatus(p, $any($event.target).value)">
                  <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
                </select>
              </td>
              <td><button class="btn-icon danger" (click)="delete(p._id)">🗑️</button></td>
            </tr>
          </tbody>
        </table>
        <p class="empty" *ngIf="!loading && filtered.length === 0">No placement records found.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { animation: fadeIn .4s ease; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
    .page-header { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem; }
    .page-header h2 { margin:0;font-size:1.6rem;color:#1e293b; }
    .subtitle { color:#64748b;margin:.25rem 0 0;font-size:.9rem; }
    .btn-primary { padding:.6rem 1.4rem;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600; }
    .btn-primary:hover { transform:translateY(-2px);box-shadow:0 4px 15px rgba(99,102,241,.4); }
    .btn-primary:disabled { opacity:.5;cursor:not-allowed;transform:none; }
    .stats-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1rem;margin-bottom:1.5rem; }
    .stat-card { background:#fff;border-radius:14px;padding:1.25rem;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.07);transition:all .2s; }
    .stat-card:hover { transform:translateY(-4px); }
    .stat-card.highlight { background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff; }
    .stat-icon { font-size:1.6rem;margin-bottom:.5rem; }
    .stat-val { display:block;font-size:1.5rem;font-weight:800;color:#1e293b; }
    .stat-card.highlight .stat-val { color:#fff; }
    .stat-lbl { font-size:.75rem;color:#64748b; }
    .stat-card.highlight .stat-lbl { color:rgba(255,255,255,.8); }
    .card { background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .form-card { padding:1.5rem;margin-bottom:1.5rem; }
    .form-card h3 { margin:0 0 1rem; }
    .form-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem; }
    .fg label { display:block;font-size:.82rem;color:#64748b;margin-bottom:.35rem;font-weight:500; }
    .fg input,.fg select { width:100%;padding:.55rem .75rem;border:1px solid #e2e8f0;border-radius:8px;font-size:.9rem;box-sizing:border-box; }
    .fg input:focus,.fg select:focus { outline:none;border-color:#6366f1; }
    .form-actions { display:flex;align-items:center;gap:1rem; }
    .success{color:#10b981} .error{color:#ef4444}
    .filter-bar { display:flex;gap:1rem;margin-bottom:1rem;flex-wrap:wrap; }
    .filter-bar select,.filter-bar input { padding:.55rem .8rem;border:1px solid #e2e8f0;border-radius:8px;font-size:.9rem; }
    .filter-bar input { flex:1; }
    .table-card { overflow-x:auto; }
    table { width:100%;border-collapse:collapse; }
    th { background:#f8fafc;padding:.8rem 1rem;font-size:.78rem;text-transform:uppercase;letter-spacing:.5px;color:#64748b;font-weight:600;text-align:left; }
    td { padding:.85rem 1rem;border-bottom:1px solid #f1f5f9;font-size:.88rem; }
    tr:hover td { background:#fafbff; }
    .type-badge { padding:.2rem .55rem;border-radius:4px;font-size:.78rem;font-weight:600; }
    .ft { background:#ecfdf5;color:#059669; } .intern { background:#eff6ff;color:#2563eb; }
    .status-select { padding:.3rem .5rem;border:1px solid #e2e8f0;border-radius:6px;font-size:.8rem; }
    .btn-icon { background:none;border:none;cursor:pointer;padding:.3rem;border-radius:6px; }
    .btn-icon.danger:hover { background:#fee2e2; }
    .loading { padding:2rem;text-align:center;color:#64748b; }
    .empty { padding:2rem;text-align:center;color:#94a3b8; }
  `]
})
export class PlacementsComponent implements OnInit {
  placements: any[] = []; filtered: any[] = []; students: any[] = []; stats: any = null;
  loading = true; showForm = false; search = ''; filterStatus = ''; filterType = '';
  msg = ''; err = '';
  types = ['Full-Time', 'Internship', 'Contract', 'Part-Time'];
  statuses = ['Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected', 'Withdrawn'];
  form: any = { studentId:'', studentName:'', department:'', companyName:'', role:'', type:'Full-Time', ctc:'', stipend:'', location:'', driveDate:'', status:'Applied' };

  constructor(private placementService: PlacementService, private studentService: StudentService) {}
  ngOnInit() { this.load(); this.loadStats(); this.loadStudents(); }

  load() { this.loading = true; this.placementService.getAll().subscribe({ next: d => { this.placements = d; this.applyFilter(); this.loading = false; }, error: () => this.loading = false }); }
  loadStats() { this.placementService.getStats().subscribe(s => this.stats = s); }
  loadStudents() { this.studentService.getAllStudents().subscribe((d: any) => this.students = d); }
  onStudentChange() { const s = this.students.find(x => x.studentId === this.form.studentId); if (s) { this.form.studentName = s.name; this.form.department = s.department; } }
  applyFilter() {
    let list = this.placements;
    if (this.filterStatus) list = list.filter(p => p.status === this.filterStatus);
    if (this.filterType) list = list.filter(p => p.type === this.filterType);
    if (this.search) { const q = this.search.toLowerCase(); list = list.filter(p => p.companyName?.toLowerCase().includes(q) || (p.studentName||p.studentId)?.toLowerCase().includes(q)); }
    this.filtered = list;
  }
  save() {
    this.msg = ''; this.err = '';
    this.placementService.create(this.form).subscribe({
      next: () => { this.msg = '✅ Saved!'; this.form = { studentId:'',studentName:'',department:'',companyName:'',role:'',type:'Full-Time',ctc:'',stipend:'',location:'',driveDate:'',status:'Applied' }; this.load(); this.loadStats(); setTimeout(() => { this.msg=''; this.showForm=false; }, 1500); },
      error: e => this.err = e.error?.message || 'Failed'
    });
  }
  updateStatus(p: any, status: string) { this.placementService.update(p._id, { status }).subscribe(() => { this.load(); this.loadStats(); }); }
  delete(id: string) { if (!confirm('Delete?')) return; this.placementService.delete(id).subscribe(() => { this.load(); this.loadStats(); }); }
}
