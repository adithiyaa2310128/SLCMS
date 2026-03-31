import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HostelService } from '../services/hostel.service';
import { AnnouncementService } from '../services/announcement.service';

@Component({
  selector: 'app-campus',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h2>Campus & Resource Management</h2><p class="subtitle">Hostel, transport & campus operations</p></div>
      </div>

      <!-- Tab Nav -->
      <div class="tab-nav">
        <button [class.active]="tab === 'hostel'" (click)="tab='hostel'">🏠 Hostel</button>
        <button [class.active]="tab === 'transport'" (click)="tab='transport'">🚌 Transport</button>
        <button [class.active]="tab === 'library'" (click)="tab='library'">📚 Library</button>
      </div>

      <!-- HOSTEL TAB -->
      <div *ngIf="tab === 'hostel'">
        <div class="section-header">
          <div class="stats-row" *ngIf="hostelStats">
            <div class="mini-stat blue"><span class="val">{{ hostelStats.totalOccupied }}</span><span class="lbl">Occupied Rooms</span></div>
            <div class="mini-stat green" *ngFor="let b of hostelStats.byBlock">
              <span class="val">{{ b.count }}</span><span class="lbl">Block {{ b._id }}</span>
            </div>
          </div>
          <button class="btn-primary" (click)="showHostelForm = !showHostelForm">{{ showHostelForm ? '✕' : '+ Assign Room' }}</button>
        </div>

        <div class="card form-card" *ngIf="showHostelForm">
          <h3>Room Assignment</h3>
          <div class="form-grid">
            <div class="fg"><label>Student ID *</label><input [(ngModel)]="hForm.studentId" placeholder="STU-001"></div>
            <div class="fg"><label>Student Name</label><input [(ngModel)]="hForm.studentName" placeholder="Full name"></div>
            <div class="fg"><label>Block *</label>
              <select [(ngModel)]="hForm.block">
                <option *ngFor="let b of ['A','B','C','D','E','F','Girls-Block']" [value]="b">Block {{ b }}</option>
              </select>
            </div>
            <div class="fg"><label>Room Number *</label><input [(ngModel)]="hForm.roomNumber" placeholder="A-101"></div>
            <div class="fg"><label>Bed Number</label><input type="number" [(ngModel)]="hForm.bedNumber" min="1" max="4"></div>
            <div class="fg"><label>Mess Plan</label>
              <select [(ngModel)]="hForm.messPlan">
                <option value="Full">Full</option>
                <option value="Lunch-Dinner">Lunch-Dinner</option>
                <option value="None">None</option>
              </select>
            </div>
            <div class="fg"><label>Emergency Contact</label><input [(ngModel)]="hForm.emergencyContact" placeholder="Phone number"></div>
          </div>
          <div class="form-actions" style="margin-top:1rem">
            <button class="btn-primary" (click)="saveHostel()" [disabled]="!hForm.studentId || !hForm.block || !hForm.roomNumber">Assign Room</button>
            <span class="success" *ngIf="hMsg">{{ hMsg }}</span>
            <span class="error" *ngIf="hErr">{{ hErr }}</span>
          </div>
        </div>

        <div class="card table-card">
          <div class="loading" *ngIf="loadingHostel">Loading...</div>
          <table *ngIf="!loadingHostel && hostelRecords.length > 0">
            <thead>
              <tr><th>Student ID</th><th>Name</th><th>Block</th><th>Room</th><th>Bed</th><th>Mess</th><th>Status</th><th>Join Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let h of hostelRecords">
                <td><code>{{ h.studentId }}</code></td>
                <td>{{ h.studentName || '—' }}</td>
                <td><span class="block-badge">{{ h.block }}</span></td>
                <td><strong>{{ h.roomNumber }}</strong></td>
                <td>{{ h.bedNumber }}</td>
                <td>{{ h.messPlan }}</td>
                <td><span class="badge" [ngClass]="h.status === 'Active' ? 'status-active' : 'status-vacated'">{{ h.status }}</span></td>
                <td>{{ h.joinDate | date:'dd MMM yy' }}</td>
                <td><button class="btn-icon danger" (click)="deleteHostel(h._id)">🗑️</button></td>
              </tr>
            </tbody>
          </table>
          <p class="empty" *ngIf="!loadingHostel && hostelRecords.length === 0">No hostel assignments yet.</p>
        </div>
      </div>

      <!-- TRANSPORT TAB -->
      <div *ngIf="tab === 'transport'" class="info-card">
        <h3>🚌 Transport Routes</h3>
        <div class="route-grid">
          <div class="route-card" *ngFor="let r of routes">
            <div class="route-num">Route {{ r.id }}</div>
            <div class="route-name">{{ r.name }}</div>
            <div class="route-stops">{{ r.stops }} stops · {{ r.time }}</div>
            <div class="route-capacity">Capacity: {{ r.capacity }} seats</div>
          </div>
        </div>
      </div>

      <!-- LIBRARY TAB -->
      <div *ngIf="tab === 'library'" class="info-card">
        <h3>📚 Library Overview</h3>
        <div class="lib-grid">
          <div class="lib-stat">
            <span class="lib-val">12,450</span><span class="lib-lbl">Total Books</span>
          </div>
          <div class="lib-stat">
            <span class="lib-val">847</span><span class="lib-lbl">Currently Issued</span>
          </div>
          <div class="lib-stat">
            <span class="lib-val">23</span><span class="lib-lbl">Overdue Returns</span>
          </div>
          <div class="lib-stat">
            <span class="lib-val">42</span><span class="lib-lbl">E-Resources</span>
          </div>
        </div>
        <p class="lib-note">📌 Library management integration coming soon. Connect to library RFID system for real-time tracking.</p>
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

    .tab-nav { display:flex; gap:.5rem; margin-bottom:1.5rem; border-bottom:2px solid #e2e8f0; padding-bottom:.5rem; }
    .tab-nav button { padding:.5rem 1.2rem; border:none; background:none; cursor:pointer; font-size:.95rem; color:#64748b; border-radius:8px 8px 0 0; transition:all .2s; font-weight:500; }
    .tab-nav button.active { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; }
    .tab-nav button:hover:not(.active) { background:#f1f5f9; }

    .section-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem; }
    .stats-row { display:flex; gap:1rem; flex-wrap:wrap; }
    .mini-stat { background:#fff; border-radius:10px; padding:.75rem 1rem; display:flex; flex-direction:column; box-shadow:0 2px 8px rgba(0,0,0,.06); min-width:100px; }
    .mini-stat .val { font-size:1.5rem; font-weight:800; } .mini-stat .lbl { font-size:.7rem; color:#64748b; }
    .blue .val { color:#3b82f6; } .green .val { color:#10b981; }

    .card { background:#fff; border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .form-card { padding:1.5rem; margin-bottom:1.5rem; }
    .form-card h3 { margin:0 0 1rem; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; }
    .fg label { display:block; font-size:.82rem; color:#64748b; margin-bottom:.35rem; font-weight:500; }
    .fg input,.fg select { width:100%; padding:.55rem .75rem; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; box-sizing:border-box; }
    .fg input:focus,.fg select:focus { outline:none; border-color:#6366f1; }
    .form-actions { display:flex; align-items:center; gap:1rem; }
    .success{color:#10b981} .error{color:#ef4444}

    .table-card { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:.8rem 1rem; font-size:.78rem; text-transform:uppercase; letter-spacing:.5px; color:#64748b; font-weight:600; text-align:left; }
    td { padding:.85rem 1rem; border-bottom:1px solid #f1f5f9; font-size:.88rem; }
    tr:hover td { background:#fafbff; }
    code { background:#f1f5f9; padding:.15rem .4rem; border-radius:4px; font-size:.8rem; }

    .block-badge { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; padding:.2rem .55rem; border-radius:6px; font-weight:700; font-size:.82rem; }
    .badge { padding:.2rem .6rem; border-radius:20px; font-size:.75rem; font-weight:600; }
    .status-active { background:#ecfdf5; color:#059669; }
    .status-vacated { background:#f1f5f9; color:#64748b; }
    .btn-icon { background:none; border:none; cursor:pointer; padding:.3rem; border-radius:6px; }
    .btn-icon.danger:hover { background:#fee2e2; }
    .loading { padding:2rem; text-align:center; color:#64748b; }
    .empty { padding:2rem; text-align:center; color:#94a3b8; }

    .info-card { background:#fff; border-radius:14px; padding:1.5rem; box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .info-card h3 { margin:0 0 1.5rem; color:#1e293b; }

    .route-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:1rem; }
    .route-card { border:1px solid #e2e8f0; border-radius:12px; padding:1rem; }
    .route-num { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:.9rem;margin-bottom:.75rem; }
    .route-name { font-weight:600; color:#1e293b; margin-bottom:.25rem; }
    .route-stops { font-size:.82rem; color:#64748b; margin-bottom:.25rem; }
    .route-capacity { font-size:.8rem; color:#10b981; font-weight:500; }

    .lib-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:1rem; margin-bottom:1.5rem; }
    .lib-stat { background:#f8fafc; border-radius:12px; padding:1rem; text-align:center; }
    .lib-val { display:block; font-size:2rem; font-weight:800; color:#6366f1; }
    .lib-lbl { font-size:.8rem; color:#64748b; }
    .lib-note { color:#64748b; font-size:.9rem; background:#fefce8; padding:1rem; border-radius:8px; border-left:4px solid #eab308; }
  `]
})
export class CampusComponent implements OnInit {
  tab = 'hostel';
  hostelRecords: any[] = [];
  hostelStats: any = null;
  loadingHostel = true;
  showHostelForm = false;
  hMsg = ''; hErr = '';
  hForm: any = { studentId:'', studentName:'', block:'A', roomNumber:'', bedNumber:1, messPlan:'Full', emergencyContact:'' };

  routes = [
    { id: 1, name: 'City Center ↔ Campus', stops: 12, time: '7:30 AM / 6:00 PM', capacity: 50 },
    { id: 2, name: 'North Zone ↔ Campus', stops: 8, time: '7:45 AM / 6:15 PM', capacity: 45 },
    { id: 3, name: 'Railway Station ↔ Campus', stops: 5, time: '8:00 AM / 5:45 PM', capacity: 40 },
    { id: 4, name: 'East suburbs ↔ Campus', stops: 10, time: '7:20 AM / 6:30 PM', capacity: 50 },
  ];

  constructor(private hostelService: HostelService, private announcementService: AnnouncementService) {}
  ngOnInit() { this.loadHostel(); }

  loadHostel() {
    this.loadingHostel = true;
    this.hostelService.getAll().subscribe({ next: d => { this.hostelRecords = d; this.loadingHostel = false; }, error: () => this.loadingHostel = false });
    this.hostelService.getStats().subscribe(s => this.hostelStats = s);
  }

  saveHostel() {
    this.hMsg = ''; this.hErr = '';
    this.hostelService.assign(this.hForm).subscribe({
      next: () => { this.hMsg = '✅ Room assigned!'; this.hForm = { studentId:'',studentName:'',block:'A',roomNumber:'',bedNumber:1,messPlan:'Full',emergencyContact:'' }; this.loadHostel(); setTimeout(() => { this.hMsg=''; this.showHostelForm=false; }, 1500); },
      error: e => this.hErr = e.error?.message || 'Failed'
    });
  }

  deleteHostel(id: string) {
    if (!confirm('Remove hostel assignment?')) return;
    this.hostelService.delete(id).subscribe(() => this.loadHostel());
  }
}
