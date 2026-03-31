import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementService } from '../services/announcement.service';

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h2>Announcements</h2><p class="subtitle">Broadcast to students, faculty & staff</p></div>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? '✕ Cancel' : '+ New Announcement' }}</button>
      </div>

      <div class="card form-card" *ngIf="showForm">
        <h3>Create Announcement</h3>
        <div class="form-grid">
          <div class="fg" style="grid-column:1/-1"><label>Title *</label><input [(ngModel)]="form.title" placeholder="Announcement title"></div>
          <div class="fg"><label>Type</label>
            <select [(ngModel)]="form.type">
              <option *ngFor="let t of types" [value]="t">{{ t }}</option>
            </select>
          </div>
          <div class="fg"><label>Target Audience</label>
            <select [(ngModel)]="form.targetAudience">
              <option *ngFor="let a of audiences" [value]="a">{{ a }}</option>
            </select>
          </div>
          <div class="fg"><label>Department</label><input [(ngModel)]="form.department" placeholder="All or specific dept"></div>
          <div class="fg"><label>Expires At</label><input type="date" [(ngModel)]="form.expiresAt"></div>
          <div class="fg"><label>Pin this announcement</label>
            <select [(ngModel)]="form.isPinned">
              <option [ngValue]="false">No</option>
              <option [ngValue]="true">Yes (Pin to top)</option>
            </select>
          </div>
        </div>
        <div class="fg full" style="margin-top:.75rem"><label>Message Body *</label>
          <textarea [(ngModel)]="form.body" placeholder="Write your announcement here..." rows="4"></textarea>
        </div>
        <div class="form-actions" style="margin-top:1rem">
          <button class="btn-primary" (click)="save()" [disabled]="!form.title || !form.body">Publish</button>
          <span class="success" *ngIf="msg">{{ msg }}</span>
          <span class="error" *ngIf="err">{{ err }}</span>
        </div>
      </div>

      <div class="filter-bar">
        <select [(ngModel)]="filterType" (change)="load()">
          <option value="">All Types</option>
          <option *ngFor="let t of types" [value]="t">{{ t }}</option>
        </select>
      </div>

      <div class="announcements-list">
        <div class="loading" *ngIf="loading">Loading...</div>
        <div class="ann-card" *ngFor="let a of announcements" [ngClass]="'ann-' + a.type.toLowerCase()">
          <div class="ann-header">
            <div class="ann-meta">
              <span class="ann-type" [ngClass]="'type-' + a.type.toLowerCase()">{{ a.type }}</span>
              <span class="ann-pin" *ngIf="a.isPinned">📌 Pinned</span>
              <span class="ann-audience">→ {{ a.targetAudience }}</span>
            </div>
            <div class="ann-actions">
              <span class="ann-date">{{ a.createdAt | date:'dd MMM yyyy' }}</span>
              <button class="btn-icon danger" (click)="delete(a._id)">🗑️</button>
            </div>
          </div>
          <h4 class="ann-title">{{ a.title }}</h4>
          <p class="ann-body">{{ a.body }}</p>
          <div class="ann-footer" *ngIf="a.expiresAt">
            <span class="expires">Expires: {{ a.expiresAt | date:'dd MMM yyyy' }}</span>
          </div>
        </div>
        <p class="empty" *ngIf="!loading && announcements.length === 0">No announcements yet.</p>
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
    .card { background:#fff;border-radius:14px;box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .form-card { padding:1.5rem;margin-bottom:1.5rem; }
    .form-card h3 { margin:0 0 1rem; }
    .form-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem; }
    .fg label { display:block;font-size:.82rem;color:#64748b;margin-bottom:.35rem;font-weight:500; }
    .fg input,.fg select,.fg textarea { width:100%;padding:.55rem .75rem;border:1px solid #e2e8f0;border-radius:8px;font-size:.9rem;box-sizing:border-box; }
    .fg textarea { resize:vertical;font-family:inherit; }
    .fg input:focus,.fg select:focus,.fg textarea:focus { outline:none;border-color:#6366f1; }
    .fg.full { width:100%; }
    .form-actions { display:flex;align-items:center;gap:1rem; }
    .success{color:#10b981} .error{color:#ef4444}
    .filter-bar { display:flex;gap:1rem;margin-bottom:1rem; }
    .filter-bar select { padding:.55rem .8rem;border:1px solid #e2e8f0;border-radius:8px;font-size:.9rem; }
    .announcements-list { display:flex;flex-direction:column;gap:1rem; }
    .ann-card { background:#fff;border-radius:14px;padding:1.25rem;box-shadow:0 2px 12px rgba(0,0,0,.07);border-left:4px solid #e2e8f0;transition:all .2s; }
    .ann-card:hover { transform:translateX(4px); }
    .ann-urgent { border-left-color:#ef4444; }
    .ann-academic { border-left-color:#6366f1; }
    .ann-finance { border-left-color:#10b981; }
    .ann-placement { border-left-color:#f59e0b; }
    .ann-event { border-left-color:#ec4899; }
    .ann-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem; }
    .ann-meta { display:flex;align-items:center;gap:.5rem; }
    .ann-type { padding:.2rem .6rem;border-radius:20px;font-size:.75rem;font-weight:700; }
    .type-urgent { background:#fef2f2;color:#dc2626; }
    .type-academic { background:#eff6ff;color:#2563eb; }
    .type-finance { background:#ecfdf5;color:#059669; }
    .type-placement { background:#fefce8;color:#ca8a04; }
    .type-event { background:#fdf4ff;color:#a21caf; }
    .type-general { background:#f1f5f9;color:#475569; }
    .ann-pin { background:#fefce8;color:#ca8a04;padding:.15rem .4rem;border-radius:4px;font-size:.75rem; }
    .ann-audience { color:#64748b;font-size:.82rem; }
    .ann-actions { display:flex;align-items:center;gap:.75rem; }
    .ann-date { font-size:.8rem;color:#94a3b8; }
    .ann-title { margin:0 0 .5rem;font-size:1rem;color:#1e293b; }
    .ann-body { margin:0;color:#475569;font-size:.9rem;line-height:1.6; }
    .ann-footer { margin-top:.75rem; }
    .expires { font-size:.78rem;color:#94a3b8; }
    .btn-icon { background:none;border:none;cursor:pointer;padding:.3rem;border-radius:6px; }
    .btn-icon.danger:hover { background:#fee2e2; }
    .loading { padding:2rem;text-align:center;color:#64748b; }
    .empty { padding:2rem;text-align:center;color:#94a3b8; background:#fff;border-radius:14px; }
  `]
})
export class AnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  loading = true;
  showForm = false;
  filterType = '';
  msg = ''; err = '';
  types = ['General', 'Urgent', 'Academic', 'Finance', 'Placement', 'Event'];
  audiences = ['All', 'Students', 'Faculty', 'Staff'];
  form: any = { title:'', body:'', type:'General', targetAudience:'All', department:'All', isPinned:false, expiresAt:'' };

  constructor(private announcementService: AnnouncementService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    const params: any = {};
    if (this.filterType) params.type = this.filterType;
    this.announcementService.getAll(params).subscribe({ next: d => { this.announcements = d; this.loading = false; }, error: () => this.loading = false });
  }

  save() {
    this.msg = ''; this.err = '';
    this.announcementService.create(this.form).subscribe({
      next: () => { this.msg = '✅ Published!'; this.form = { title:'',body:'',type:'General',targetAudience:'All',department:'All',isPinned:false,expiresAt:'' }; this.load(); setTimeout(() => { this.msg=''; this.showForm=false; }, 1500); },
      error: e => this.err = e.error?.message || 'Failed'
    });
  }

  delete(id: string) {
    if (!confirm('Delete announcement?')) return;
    this.announcementService.delete(id).subscribe(() => this.load());
  }
}
