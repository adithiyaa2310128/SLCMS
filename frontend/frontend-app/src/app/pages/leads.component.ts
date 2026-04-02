import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../services/lead.service';

@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Lead Management</h2>
          <p class="subtitle">Track & convert prospective students</p>
        </div>
        <button class="btn-primary" (click)="showForm = !showForm">
          {{ showForm ? '✕ Cancel' : '+ New Lead' }}
        </button>
      </div>

      <!-- Stats Row -->
      <div class="stats-row" *ngIf="stats">
        <div class="mini-stat blue"><span class="val">{{ stats.total }}</span><span class="lbl">Total Leads</span></div>
        <div class="mini-stat green"><span class="val">{{ getCount('Enrolled') }}</span><span class="lbl">Enrolled</span></div>
        <div class="mini-stat orange"><span class="val">{{ getCount('Interested') }}</span><span class="lbl">Interested</span></div>
        <div class="mini-stat red"><span class="val">{{ getCount('Dropped') }}</span><span class="lbl">Dropped</span></div>
        <div class="mini-stat purple"><span class="val">{{ stats.conversionRate }}%</span><span class="lbl">Conversion Rate</span></div>
      </div>

      <!-- Add Lead Form -->
      <div class="card form-card" *ngIf="showForm">
        <h3>New Lead</h3>
        <div class="form-grid">
          <div class="fg"><label>Full Name *</label><input [(ngModel)]="form.name" placeholder="Student name"></div>
          <div class="fg"><label>Email *</label><input type="email" [(ngModel)]="form.email" placeholder="Email address"></div>
          <div class="fg"><label>Phone</label><input [(ngModel)]="form.phone" placeholder="+91 XXXXX XXXXX"></div>
          <div class="fg"><label>Source</label>
            <select [(ngModel)]="form.source">
              <option *ngFor="let s of sources" [value]="s">{{ s }}</option>
            </select>
          </div>
          <div class="fg"><label>Program of Interest</label><input [(ngModel)]="form.program" placeholder="e.g. B.Tech Computer Science"></div>
          <div class="fg"><label>Status</label>
            <select [(ngModel)]="form.status">
              <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
            </select>
          </div>
          <div class="fg"><label>Follow-up Date</label><input type="date" [(ngModel)]="form.followUpDate"></div>
          <div class="fg"><label>Campaign</label><input [(ngModel)]="form.campaign" placeholder="e.g. Open Day 2026"></div>
        </div>
        <div class="form-actions">
          <button class="btn-primary" (click)="saveLead()" [disabled]="!form.name || !form.email">Save Lead</button>
          <span class="success" *ngIf="msg">{{ msg }}</span>
          <span class="error" *ngIf="err">{{ err }}</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <select [(ngModel)]="filterStatus" (ngModelChange)="loadLeads()">
          <option value="">All Statuses</option>
          <option *ngFor="let s of statuses" [value]="s">{{ s }}</option>
        </select>
        <input [(ngModel)]="search" placeholder="🔍 Search by name or email..." (input)="applySearch()">
      </div>

      <!-- Table -->
      <div class="card table-card">
        <div class="loading" *ngIf="loading">Loading leads...</div>
        <table *ngIf="!loading && filtered.length > 0">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>Source</th>
              <th>Program</th><th>Status</th><th>Lead Score</th><th>Follow-up</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let l of filtered">
              <td><strong>{{ l.name }}</strong></td>
              <td>{{ l.email }}</td>
              <td>{{ l.phone || '—' }}</td>
              <td><span class="tag">{{ l.source }}</span></td>
              <td>{{ l.program || '—' }}</td>
              <td><span class="badge" [ngClass]="statusClass(l.status)">{{ l.status }}</span></td>
              <td>
                <div class="score-bar">
                  <div class="score-fill" [style.width]="l.leadScore + '%'" [ngClass]="scoreClass(l.leadScore)"></div>
                </div>
                <span class="score-num">{{ l.leadScore }}</span>
              </td>
              <td>{{ l.followUpDate ? (l.followUpDate | date:'dd MMM') : '—' }}</td>
              <td class="actions">
                <select (ngModelChange)="updateStatus(l, $any($event.target).value)" class="status-select">
                  <option value="">Change status</option>
                  <option *ngFor="let s of statuses" [value]="s">→ {{ s }}</option>
                </select>
                <button class="btn-icon danger" (click)="deleteLead(l._id)" title="Delete">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="empty" *ngIf="!loading && filtered.length === 0">No leads found.</p>
      </div>
    </div>
  `,
  styles: [`
    .page { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
    .page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem; }
    .page-header h2 { margin:0; font-size:1.6rem; color:#1e293b; }
    .subtitle { color:#64748b; margin:0.25rem 0 0; font-size:0.9rem; }
    .btn-primary { padding:0.6rem 1.4rem; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; font-size:0.95rem; transition:all .2s; }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 4px 15px rgba(99,102,241,.4); }
    .btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }

    .stats-row { display:flex; gap:1rem; margin-bottom:1.5rem; flex-wrap:wrap; }
    .mini-stat { background:#fff; border-radius:12px; padding:1rem 1.4rem; display:flex; flex-direction:column; gap:0.2rem; box-shadow:0 2px 8px rgba(0,0,0,.06); flex:1; min-width:120px; }
    .mini-stat .val { font-size:1.8rem; font-weight:800; line-height:1; }
    .mini-stat .lbl { font-size:0.75rem; color:#64748b; font-weight:500; }
    .blue .val { color:#3b82f6; } .green .val { color:#10b981; } .orange .val { color:#f59e0b; } .red .val { color:#ef4444; } .purple .val { color:#8b5cf6; }

    .card { background:#fff; border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .form-card { padding:1.5rem; margin-bottom:1.5rem; }
    .form-card h3 { margin:0 0 1rem; color:#1e293b; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1rem; margin-bottom:1rem; }
    .fg label { display:block; font-size:0.82rem; color:#64748b; margin-bottom:0.35rem; font-weight:500; }
    .fg input, .fg select { width:100%; padding:0.55rem 0.75rem; border:1px solid #e2e8f0; border-radius:8px; font-size:0.9rem; box-sizing:border-box; transition:border-color .2s; }
    .fg input:focus, .fg select:focus { outline:none; border-color:#6366f1; }
    .form-actions { display:flex; align-items:center; gap:1rem; }
    .success { color:#10b981; font-size:0.9rem; }
    .error { color:#ef4444; font-size:0.9rem; }

    .filter-bar { display:flex; gap:1rem; margin-bottom:1rem; }
    .filter-bar select, .filter-bar input { padding:0.55rem 0.8rem; border:1px solid #e2e8f0; border-radius:8px; font-size:0.9rem; }
    .filter-bar input { flex:1; }

    .table-card { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:0.8rem 1rem; font-size:0.78rem; text-transform:uppercase; letter-spacing:.5px; color:#64748b; font-weight:600; text-align:left; }
    td { padding:0.85rem 1rem; border-bottom:1px solid #f1f5f9; font-size:0.88rem; color:#374151; }
    tr:last-child td { border-bottom:none; }
    tr:hover td { background:#fafbff; }

    .badge { padding:0.2rem 0.65rem; border-radius:20px; font-size:0.75rem; font-weight:600; }
    .status-new { background:#eff6ff; color:#3b82f6; }
    .status-contacted { background:#f0fdf4; color:#16a34a; }
    .status-interested { background:#fefce8; color:#ca8a04; }
    .status-applied { background:#fdf4ff; color:#a21caf; }
    .status-enrolled { background:#ecfdf5; color:#059669; }
    .status-dropped { background:#fef2f2; color:#dc2626; }
    .tag { background:#f1f5f9; color:#475569; padding:0.2rem 0.5rem; border-radius:4px; font-size:0.78rem; }

    .score-bar { background:#f1f5f9; border-radius:4px; height:6px; width:80px; overflow:hidden; display:inline-block; margin-right:6px; vertical-align:middle; }
    .score-fill { height:100%; border-radius:4px; transition:width .3s; }
    .score-low { background:#f87171; } .score-mid { background:#fbbf24; } .score-high { background:#34d399; }
    .score-num { font-size:0.82rem; font-weight:700; color:#374151; }

    .actions { display:flex; gap:0.5rem; align-items:center; }
    .status-select { padding:0.35rem 0.5rem; border:1px solid #e2e8f0; border-radius:6px; font-size:0.8rem; }
    .btn-icon { background:none; border:none; cursor:pointer; padding:0.3rem; border-radius:6px; font-size:1rem; }
    .btn-icon.danger:hover { background:#fee2e2; }
    .loading { padding:2rem; text-align:center; color:#64748b; }
    .empty { padding:2rem; text-align:center; color:#94a3b8; }
  `]
})
export class LeadsComponent implements OnInit {
  leads: any[] = [];
  filtered: any[] = [];
  stats: any = null;
  loading = true;
  showForm = false;
  search = '';
  filterStatus = '';
  msg = '';
  err = '';

  sources = ['Website', 'Event', 'Campaign', 'Referral', 'Social Media', 'Walk-in', 'Other'];
  statuses = ['New', 'Contacted', 'Interested', 'Applied', 'Enrolled', 'Dropped'];

  form: any = { name: '', email: '', phone: '', source: 'Website', program: '', status: 'New', followUpDate: '', campaign: '' };

  constructor(private leadService: LeadService) {}

  ngOnInit() { this.loadLeads(); this.loadStats(); }

  loadLeads() {
    this.loading = true;
    this.leadService.getAll().subscribe({
      next: data => { this.leads = data; this.applySearch(); this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadStats() { this.leadService.getStats().subscribe(s => this.stats = s); }

  applySearch() {
    let list = this.leads;
    if (this.filterStatus) list = list.filter(l => l.status === this.filterStatus);
    if (this.search) {
      const q = this.search.toLowerCase();
      list = list.filter(l => l.name?.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q));
    }
    this.filtered = list;
  }

  getCount(status: string) { return this.stats?.byStatus?.find((s: any) => s._id === status)?.count || 0; }

  saveLead() {
    this.msg = ''; this.err = '';
    this.leadService.create(this.form).subscribe({
      next: () => {
        this.msg = '✅ Lead added!';
        this.form = { name:'',email:'',phone:'',source:'Website',program:'',status:'New',followUpDate:'',campaign:'' };
        this.loadLeads(); this.loadStats();
        setTimeout(() => { this.msg = ''; this.showForm = false; }, 1500);
      },
      error: e => this.err = e.error?.message || 'Failed to add lead'
    });
  }

  updateStatus(lead: any, status: string) {
    if (!status) return;
    this.leadService.update(lead._id, { status }).subscribe(() => { this.loadLeads(); this.loadStats(); });
  }

  deleteLead(id: string) {
    if (!confirm('Delete this lead?')) return;
    this.leadService.delete(id).subscribe(() => { this.loadLeads(); this.loadStats(); });
  }

  statusClass(s: string) {
    const map: any = { New:'status-new', Contacted:'status-contacted', Interested:'status-interested', Applied:'status-applied', Enrolled:'status-enrolled', Dropped:'status-dropped' };
    return map[s] || 'status-new';
  }

  scoreClass(score: number) { return score >= 70 ? 'score-high' : score >= 40 ? 'score-mid' : 'score-low'; }
}
