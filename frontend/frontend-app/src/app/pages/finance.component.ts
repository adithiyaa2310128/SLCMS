import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeeService } from '../services/fee.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div><h2>Finance & Fee Management</h2><p class="subtitle">Payments, receipts & financial reports</p></div>
        <button class="btn-primary" (click)="showForm = !showForm">{{ showForm ? '✕ Cancel' : '+ Add Fee Record' }}</button>
      </div>

      <!-- Financial Summary Cards -->
      <div class="summary-grid" *ngIf="stats">
        <div class="sum-card green">
          <div class="sum-icon">💰</div>
          <div class="sum-info">
            <span class="sum-val">₹{{ (stats.totalPaid / 100000).toFixed(1) }}L</span>
            <span class="sum-lbl">Total Collected</span>
          </div>
        </div>
        <div class="sum-card blue">
          <div class="sum-icon">📋</div>
          <div class="sum-info">
            <span class="sum-val">₹{{ ((stats.totalDue - stats.totalPaid) / 100000).toFixed(1) }}L</span>
            <span class="sum-lbl">Pending Dues</span>
          </div>
        </div>
        <div class="sum-card red">
          <div class="sum-icon">⚠️</div>
          <div class="sum-info">
            <span class="sum-val">{{ stats.overdueCount }}</span>
            <span class="sum-lbl">Overdue Records</span>
          </div>
        </div>
        <div class="sum-card purple">
          <div class="sum-icon">📊</div>
          <div class="sum-info">
            <span class="sum-val">{{ stats.totalDue > 0 ? ((stats.totalPaid / stats.totalDue) * 100).toFixed(0) : 0 }}%</span>
            <span class="sum-lbl">Collection Rate</span>
          </div>
        </div>
      </div>

      <!-- Add Fee Form -->
      <div class="card form-card" *ngIf="showForm">
        <h3>New Fee Record</h3>
        <div class="form-grid">
          <div class="fg"><label>Student *</label>
            <select [(ngModel)]="form.studentId" (ngModelChange)="onStudentChange()">
              <option value="">-- Select Student --</option>
              <option *ngFor="let s of students" [value]="s.studentId">{{ s.name }} ({{ s.studentId }})</option>
            </select>
          </div>
          <div class="fg"><label>Fee Type *</label>
            <select [(ngModel)]="form.feeType">
              <option *ngFor="let f of feeTypes" [value]="f">{{ f }}</option>
            </select>
          </div>
          <div class="fg"><label>Amount (₹) *</label><input type="number" [(ngModel)]="form.amount" placeholder="50000"></div>
          <div class="fg"><label>Discount (₹)</label><input type="number" [(ngModel)]="form.discount" placeholder="0"></div>
          <div class="fg"><label>Due Date *</label><input type="date" [(ngModel)]="form.dueDate"></div>
          <div class="fg"><label>Semester</label>
            <select [(ngModel)]="form.semester">
              <option *ngFor="let s of [1,2,3,4,5,6,7,8]" [value]="s">Sem {{ s }}</option>
            </select>
          </div>
          <div class="fg"><label>Academic Year</label><input [(ngModel)]="form.academicYear" placeholder="2025-26"></div>
        </div>
        <div class="form-actions" style="margin-top:1rem">
          <button class="btn-primary" (click)="save()" [disabled]="!form.studentId || !form.feeType || !form.amount || !form.dueDate">Create Fee Record</button>
          <span class="success" *ngIf="msg">{{ msg }}</span>
          <span class="error" *ngIf="err">{{ err }}</span>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <select [(ngModel)]="filterStatus" (ngModelChange)="applyFilter()">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Waived">Waived</option>
        </select>
        <select [(ngModel)]="filterType" (ngModelChange)="applyFilter()">
          <option value="">All Types</option>
          <option *ngFor="let f of feeTypes" [value]="f">{{ f }}</option>
        </select>
        <input [(ngModel)]="search" placeholder="🔍 Search student..." (input)="applyFilter()">
      </div>

      <!-- Table -->
      <div class="card table-card">
        <div class="loading" *ngIf="loading">Loading...</div>
        <table *ngIf="!loading && filtered.length > 0">
          <thead>
            <tr><th>Student</th><th>Fee Type</th><th>Amount</th><th>Discount</th><th>Fine</th><th>Net</th><th>Due Date</th><th>Status</th><th>Receipt</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of filtered">
              <td>{{ f.studentName || f.studentId }}</td>
              <td><span class="fee-type">{{ f.feeType }}</span></td>
              <td>₹{{ f.amount | number }}</td>
              <td class="discount">{{ f.discount > 0 ? '-₹' + (f.discount|number) : '—' }}</td>
              <td class="fine">{{ f.fine > 0 ? '+₹' + (f.fine|number) : '—' }}</td>
              <td><strong>₹{{ f.netAmount | number }}</strong></td>
              <td [class.overdue-date]="f.status === 'Overdue'">{{ f.dueDate | date:'dd MMM yy' }}</td>
              <td><span class="badge" [ngClass]="statusClass(f.status)">{{ f.status }}</span></td>
              <td><span class="receipt" *ngIf="f.receiptNumber">{{ f.receiptNumber }}</span><span *ngIf="!f.receiptNumber">—</span></td>
              <td class="actions">
                <select class="pay-select" (ngModelChange)="pay(f, $any($event.target).value)" *ngIf="f.status !== 'Paid' && f.status !== 'Waived'">
                  <option value="">💳 Pay via...</option>
                  <option value="Online">Online</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="DD">DD</option>
                </select>
                <span class="paid-tag" *ngIf="f.status === 'Paid'">✅ Paid</span>
                <button class="btn-icon danger" (click)="delete(f._id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="empty" *ngIf="!loading && filtered.length === 0">No fee records found.</p>
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

    .summary-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; margin-bottom:1.5rem; }
    .sum-card { background:#fff; border-radius:14px; padding:1.25rem; display:flex; align-items:center; gap:1rem; box-shadow:0 2px 12px rgba(0,0,0,.07); border-left:4px solid; }
    .sum-card.green { border-left-color:#10b981; } .sum-card.blue { border-left-color:#3b82f6; } .sum-card.red { border-left-color:#ef4444; } .sum-card.purple { border-left-color:#8b5cf6; }
    .sum-icon { font-size:1.8rem; }
    .sum-info { display:flex; flex-direction:column; gap:.2rem; }
    .sum-val { font-size:1.5rem; font-weight:800; color:#1e293b; }
    .sum-lbl { font-size:.75rem; color:#64748b; font-weight:500; }

    .card { background:#fff; border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .form-card { padding:1.5rem; margin-bottom:1.5rem; }
    .form-card h3 { margin:0 0 1rem; }
    .form-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; }
    .fg label { display:block; font-size:.82rem; color:#64748b; margin-bottom:.35rem; font-weight:500; }
    .fg input,.fg select { width:100%; padding:.55rem .75rem; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; box-sizing:border-box; }
    .fg input:focus,.fg select:focus { outline:none; border-color:#6366f1; }
    .form-actions { display:flex; align-items:center; gap:1rem; }
    .success{color:#10b981} .error{color:#ef4444}

    .filter-bar { display:flex; gap:1rem; margin-bottom:1rem; flex-wrap:wrap; }
    .filter-bar select,.filter-bar input { padding:.55rem .8rem; border:1px solid #e2e8f0; border-radius:8px; font-size:.9rem; }
    .filter-bar input { flex:1; }

    .table-card { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; }
    th { background:#f8fafc; padding:.8rem 1rem; font-size:.78rem; text-transform:uppercase; letter-spacing:.5px; color:#64748b; font-weight:600; text-align:left; }
    td { padding:.85rem 1rem; border-bottom:1px solid #f1f5f9; font-size:.88rem; }
    tr:hover td { background:#fafbff; }
    .discount { color:#10b981; font-size:.85rem; }
    .fine { color:#ef4444; font-size:.85rem; }
    .overdue-date { color:#ef4444; font-weight:600; }
    .fee-type { background:#f0f9ff; color:#0369a1; padding:.2rem .5rem; border-radius:4px; font-size:.8rem; font-weight:600; }
    .receipt { font-family:monospace; background:#f8fafc; padding:.15rem .4rem; border-radius:4px; font-size:.78rem; color:#374151; }

    .badge { padding:.2rem .65rem; border-radius:20px; font-size:.75rem; font-weight:600; }
    .status-Paid { background:#ecfdf5; color:#059669; }
    .status-Pending { background:#eff6ff; color:#2563eb; }
    .status-Overdue { background:#fef2f2; color:#dc2626; }
    .status-Waived { background:#f5f3ff; color:#7c3aed; }

    .actions { display:flex; gap:.5rem; align-items:center; }
    .pay-select { padding:.3rem .5rem; border:1px solid #e2e8f0; border-radius:6px; font-size:.8rem; }
    .paid-tag { color:#059669; font-size:.82rem; font-weight:600; }
    .btn-icon { background:none; border:none; cursor:pointer; padding:.3rem; border-radius:6px; }
    .btn-icon.danger:hover { background:#fee2e2; }
    .loading { padding:2rem; text-align:center; color:#64748b; }
    .empty { padding:2rem; text-align:center; color:#94a3b8; }
  `]
})
export class FinanceComponent implements OnInit {
  fees: any[] = [];
  filtered: any[] = [];
  students: any[] = [];
  stats: any = null;
  loading = true;
  showForm = false;
  search = ''; filterStatus = ''; filterType = '';
  msg = ''; err = '';
  feeTypes = ['Tuition', 'Hostel', 'Transport', 'Library', 'Lab', 'Exam', 'Development', 'Other'];
  form: any = { studentId:'', studentName:'', feeType:'Tuition', amount:'', discount:0, dueDate:'', semester:1, academicYear:'2025-26' };

  constructor(private feeService: FeeService, private studentService: StudentService) {}
  ngOnInit() { this.load(); this.loadStats(); this.loadStudents(); }

  load() {
    this.loading = true;
    this.feeService.getAll().subscribe({ next: d => { this.fees = d; this.applyFilter(); this.loading = false; }, error: () => this.loading = false });
  }
  loadStats() { this.feeService.getStats().subscribe(s => this.stats = s); }
  loadStudents() { this.studentService.getAllStudents().subscribe((d: any) => this.students = d); }

  onStudentChange() {
    const s = this.students.find(x => x.studentId === this.form.studentId);
    if (s) { this.form.studentName = s.name; this.form.department = s.department; }
  }

  applyFilter() {
    let list = this.fees;
    if (this.filterStatus) list = list.filter(f => f.status === this.filterStatus);
    if (this.filterType) list = list.filter(f => f.feeType === this.filterType);
    if (this.search) { const q = this.search.toLowerCase(); list = list.filter(f => (f.studentName||f.studentId)?.toLowerCase().includes(q)); }
    this.filtered = list;
  }

  save() {
    this.msg = ''; this.err = '';
    this.feeService.create(this.form).subscribe({
      next: () => { this.msg = '✅ Fee record created!'; this.form = { studentId:'',studentName:'',feeType:'Tuition',amount:'',discount:0,dueDate:'',semester:1,academicYear:'2025-26' }; this.load(); this.loadStats(); setTimeout(() => { this.msg=''; this.showForm=false; }, 1500); },
      error: e => this.err = e.error?.message || 'Failed'
    });
  }

  pay(fee: any, mode: string) {
    if (!mode) return;
    this.feeService.recordPayment(fee._id, mode).subscribe(() => { this.load(); this.loadStats(); });
  }

  delete(id: string) {
    if (!confirm('Delete this fee record?')) return;
    this.feeService.delete(id).subscribe(() => { this.load(); this.loadStats(); });
  }

  statusClass(s: string) { return `status-${s}`; }
}
