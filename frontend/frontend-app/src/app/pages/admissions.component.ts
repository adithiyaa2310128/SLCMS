import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdmissionService } from '../services/admission.service';

@Component({
  selector: 'app-admissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h2>Admissions</h2><p class="subtitle">Application tracking & enrollment</p></div>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? '✕ Cancel' : '+ New Application' }}</button>
      </div>

      <!-- Stats -->
      <div class="stats-row" *ngIf="stats">
        <div class="mini-stat blue"><span class="val">{{ stats.total }}</span><span class="lbl">Total Applications</span></div>
        <div class="mini-stat yellow"><span class="val">{{ getCount('Pending') }}</span><span class="lbl">Pending</span></div>
        <div class="mini-stat orange"><span class="val">{{ getCount('Shortlisted') }}</span><span class="lbl">Shortlisted</span></div>
        <div class="mini-stat green"><span class="val">{{ getCount('Selected') }}</span><span class="lbl">Selected</span></div>
        <div class="mini-stat purple"><span class="val">{{ getCount('Enrolled') }}</span><span class="lbl">Enrolled</span></div>
        <div class="mini-stat red"><span class="val">{{ getCount('Rejected') }}</span><span class="lbl">Rejected</span></div>
      </div>

      <!-- Form -->
      <div class="card form-card" *ngIf="showForm">
        <h3>New Application</h3>
        <div class="form-grid">
          <div class="fg"><label>Full Name *</label><input [(ngModel)]="form.name" placeholder="Applicant name"></div>
          <div class="fg"><label>Email *</label><input type="email" [(ngModel)]="form.email" placeholder="Email"></div>
          <div class="fg"><label>Phone</label><input [(ngModel)]="form.phone" placeholder="Phone number"></div>
          <div class="fg"><label>Program *</label><input [(ngModel)]="form.program" placeholder="e.g. B.Tech"></div>
          <div class="fg"><label>Department *</label>
            <select [(ngModel)]="form.department">
              <option value="">-- Select --</option>
              <option *ngFor="let d of departments" [value]="d">{{ d }}</option>
            </select>
          </div>
          <div class="fg"><label>Entrance Score</label><input type="number" [(ngModel)]="form.entranceScore" placeholder="Score out of 100"></div>
          <div class="fg"><label>Interview Date</label><input type="date" [(ngModel)]="form.interviewDate"></div>
          <div class="fg"><label>Status</label>
            <select [(ngModel)]="form.applicationStatus">
              <option *ngFor="let s of appStatuses" [value]="s">{{ s }}</option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-primary" (click)="save()" [disabled]="!form.name || !form.email || !form.program || !form.department">Submit Application</button>
          <span class="success" *ngIf="msg">{{ msg }}</span>
          <span class="error" *ngIf="err">{{ err }}</span>
        </div>
      </div>

      <!-- Filter -->
      <div class="filter-bar">
        <select [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
          <option value="">All Statuses</option>
          <option *ngFor="let s of appStatuses" [value]="s">{{ s }}</option>
        </select>
        <input [(ngModel)]="search" placeholder="🔍 Search applicant..." (input)="applyFilter()">
      </div>

      <!-- Table -->
      <div class="card table-card">
        <div class="loading" *ngIf="loading">Loading...</div>
        <table *ngIf="!loading && filtered.length > 0">
          <thead>
            <tr><th>App No.</th><th>Name</th><th>Program</th><th>Dept</th><th>Score</th><th>Interview</th><th>Status</th><th>Docs</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of filtered">
              <td><code>{{ a.applicationNumber }}</code></td>
              <td><strong>{{ a.name }}</strong><br><small>{{ a.email }}</small></td>
              <td>{{ a.program }}</td>
              <td>{{ a.department }}</td>
              <td>{{ a.entranceScore ?? '—' }}</td>
              <td>{{ a.interviewDate ? (a.interviewDate | date:'dd MMM') : '—' }}</td>
              <td>
                <select class="status-select" [value]="a.applicationStatus" (ngModelChange)="updateStatus(a, $any($event.target).value)">
                  <option *ngFor="let s of appStatuses" [value]="s">{{ s }}</option>
                </select>
              </td>
              <td>
                <span class="doc-count">{{ uploadedDocs(a) }}/{{ a.documents?.length || 5 }}</span>
              </td>
              <td class="actions">
                <button class="btn-enroll" (click)="enroll(a)" *ngIf="a.applicationStatus === 'Selected'" title="Enroll Student">✅ Enroll</button>
                <button class="btn-icon danger" (click)="deleteApp(a._id)" title="Delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="empty" *ngIf="!loading && filtered.length === 0">No applications found.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; }
    .page-header h2 { margin:0; font-size:1.6rem; color:#1e293b; }
    .subtitle { color:#64748b; margin:0.25rem 0 0; font-size:0.9rem; }
    .btn-primary { padding:0.6rem 1.4rem; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 4px 15px rgba(99,102,241,.4); }
    .btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }

    .stats-row { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:1rem; margin-bottom:1.5rem; }
    .mini-stat { background:#fff; border-radius:12px; padding:1rem; display:flex; flex-direction:column; gap:.2rem; box-shadow:0 2px 8px rgba(0,0,0,.07); }
    .mini-stat .val { font-size:1.8rem; font-weight:800; line-height:1; }
    .mini-stat .lbl { font-size:.72rem; color:#64748b; font-weight:500; }
    .blue .val{color:#3b82f6} .yellow .val{color:#eab308} .orange .val{color:#f97316} .green .val{color:#22c55e} .purple .val{color:#a855f7} .red .val{color:#ef4444}

    .card { background:#fff; border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .form-card { padding:1.5rem; margin-bottom:1.5rem; }
    .form-card h3 { margin:0 0 1rem; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1rem; margin-bottom:1rem; }
    .fg label { display:block; font-size:.82rem; color:#64748b; margin-bottom:.35rem; font-weight:500; }
    .fg input,.fg select { width:100%; padding:.55rem .75rem; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; box-sizing:border-box; }
    .fg input:focus,.fg select:focus { outline:none; border-color:#6366f1; }
    .form-actions { display:flex; align-items:center; gap:1rem; }
    .success{color:#10b981;font-size:.9rem} .error{color:#ef4444;font-size:.9rem}

    .filter-bar { display:flex; gap:1rem; margin-bottom:1rem; }
    .filter-bar select,.filter-bar input { padding:.55rem .8rem; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; }
    .filter-bar input { flex:1; }

    .table-card { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:.8rem 1rem; font-size:.78rem; text-transform:uppercase; letter-spacing:.5px; color:#64748b; font-weight:600; text-align:left; }
    td { padding:.85rem 1rem; border-bottom:1px solid #f1f5f9; font-size:.88rem; }
    tr:hover td { background:#fafbff; }
    code { background:#f1f5f9; padding:.2rem .5rem; border-radius:4px; font-size:.8rem; }
    small { color:#94a3b8; }
    .status-select { padding:.35rem .5rem; border:1px solid #e2e8f0; border-radius:6px; font-size:.8rem; }
    .doc-count { background:#f0f9ff; color:#0369a1; padding:.2rem .5rem; border-radius:4px; font-size:.8rem; font-weight:600; }
    .actions { display:flex; gap:.5rem; align-items:center; }
    .btn-enroll { padding:.3rem .7rem; background:#10b981; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:.8rem; font-weight:600; }
    .btn-enroll:hover { background:#059669; }
    .btn-icon { background:none; border:none; cursor:pointer; padding:.3rem; border-radius:6px; }
    .btn-icon.danger:hover { background:#fee2e2; }
    .loading { padding:2rem; text-align:center; color:#64748b; }
    .empty { padding:2rem; text-align:center; color:#94a3b8; }
  `]
})
export class AdmissionsComponent implements OnInit {
  admissions: any[] = [];
  filtered: any[] = [];
  stats: any = null;
  loading = true;
  showForm = false;
  search = '';
  filterStatus = '';
  msg = ''; err = '';

  departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Information Technology'];
  appStatuses = ['Pending', 'Shortlisted', 'Selected', 'Rejected', 'Enrolled'];
  form: any = { name:'', email:'', phone:'', program:'', department:'', entranceScore:'', interviewDate:'', applicationStatus:'Pending' };

  constructor(private admissionService: AdmissionService) {}

  ngOnInit() { this.load(); this.loadStats(); }

  load() {
    this.loading = true;
    this.admissionService.getAll().subscribe({ next: d => { this.admissions = d; this.applyFilter(); this.loading = false; }, error: () => this.loading = false });
  }

  loadStats() { this.admissionService.getStats().subscribe(s => this.stats = s); }

  applyFilter() {
    let list = this.admissions;
    if (this.filterStatus) list = list.filter(a => a.applicationStatus === this.filterStatus);
    if (this.search) { const q = this.search.toLowerCase(); list = list.filter(a => a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q)); }
    this.filtered = list;
  }

  getCount(status: string) { return this.stats?.byStatus?.find((s: any) => s._id === status)?.count || 0; }
  uploadedDocs(a: any) { return a.documents?.filter((d: any) => d.uploaded).length || 0; }

  save() {
    this.msg = ''; this.err = '';
    this.admissionService.create(this.form).subscribe({
      next: () => { this.msg = '✅ Application submitted!'; this.form = { name:'',email:'',phone:'',program:'',department:'',entranceScore:'',interviewDate:'',applicationStatus:'Pending' }; this.load(); this.loadStats(); setTimeout(() => { this.msg=''; this.showForm=false; }, 1500); },
      error: e => this.err = e.error?.message || 'Failed'
    });
  }

  updateStatus(a: any, status: string) {
    this.admissionService.update(a._id, { applicationStatus: status }).subscribe(() => { this.load(); this.loadStats(); });
  }

  enroll(a: any) {
    if (!confirm(`Enroll ${a.name} as a student?`)) return;
    this.admissionService.enroll(a._id).subscribe({
      next: () => { alert('Student enrolled successfully!'); this.load(); this.loadStats(); },
      error: e => alert(e.error?.message || 'Failed to enroll')
    });
  }

  deleteApp(id: string) {
    if (!confirm('Delete this application?')) return;
    this.admissionService.delete(id).subscribe(() => { this.load(); this.loadStats(); });
  }
}
