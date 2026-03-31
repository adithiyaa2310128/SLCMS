import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../services/analytics.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h2>Analytics & Insights</h2>
          <p class="subtitle">Real-time intelligence across all lifecycle stages</p>
        </div>
        <button class="btn-refresh" (click)="loadData()">🔄 Refresh</button>
      </div>

      <div class="loading-overlay" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading analytics...</p>
      </div>

      <div *ngIf="!loading && data">

        <!-- KPI Row -->
        <div class="kpi-grid">
          <div class="kpi-card indigo">
            <div class="kpi-icon">👨‍🎓</div>
            <div class="kpi-info"><span class="kpi-val">{{ data.overview.totalStudents }}</span><span class="kpi-lbl">Total Students</span></div>
          </div>
          <div class="kpi-card green">
            <div class="kpi-icon">📊</div>
            <div class="kpi-info"><span class="kpi-val">{{ data.attendance.avgAttendance }}%</span><span class="kpi-lbl">Avg Attendance</span></div>
          </div>
          <div class="kpi-card yellow">
            <div class="kpi-icon">📋</div>
            <div class="kpi-info"><span class="kpi-val">{{ data.admissionFunnel.enrolled }}</span><span class="kpi-lbl">Enrolled This Year</span></div>
          </div>
          <div class="kpi-card rose">
            <div class="kpi-icon">🎯</div>
            <div class="kpi-info"><span class="kpi-val">{{ data.placement.placementRate }}%</span><span class="kpi-lbl">Placement Rate</span></div>
          </div>
          <div class="kpi-card purple">
            <div class="kpi-icon">🎓</div>
            <div class="kpi-info"><span class="kpi-val">{{ data.overview.totalAlumni }}</span><span class="kpi-lbl">Alumni Network</span></div>
          </div>
          <div class="kpi-card teal">
            <div class="kpi-icon">💰</div>
            <div class="kpi-info"><span class="kpi-val">{{ data.placement.avgCTC }} LPA</span><span class="kpi-lbl">Avg Placement CTC</span></div>
          </div>
        </div>

        <!-- Charts Row 1 -->
        <div class="charts-row">
          <div class="chart-card">
            <h4>Department-wise Students</h4>
            <canvas #deptChart></canvas>
          </div>
          <div class="chart-card">
            <h4>Risk Distribution</h4>
            <canvas #riskChart></canvas>
          </div>
          <div class="chart-card">
            <h4>Student Lifecycle Stages</h4>
            <canvas #lifecycleChart></canvas>
          </div>
        </div>

        <!-- Admission Funnel -->
        <div class="funnel-card">
          <h4>Admission Conversion Funnel</h4>
          <div class="funnel">
            <div class="funnel-step" style="width:100%">
              <div class="funnel-bar" style="background:#6366f1"><span>Leads</span><strong>{{ data.admissionFunnel.leads }}</strong></div>
            </div>
            <div class="funnel-step" style="width:85%">
              <div class="funnel-bar" style="background:#8b5cf6"><span>Applied</span><strong>{{ data.admissionFunnel.applied }}</strong></div>
            </div>
            <div class="funnel-step" style="width:65%">
              <div class="funnel-bar" style="background:#a78bfa"><span>Selected</span><strong>{{ data.admissionFunnel.selected }}</strong></div>
            </div>
            <div class="funnel-step" style="width:50%">
              <div class="funnel-bar" style="background:#c4b5fd"><span>Enrolled</span><strong>{{ data.admissionFunnel.enrolled }}</strong></div>
            </div>
          </div>
          <div class="funnel-stats">
            <span>Lead Conversion: <strong>{{ data.admissionFunnel.leadConversion }}%</strong></span>
            <span>Admission Conversion: <strong>{{ data.admissionFunnel.admissionConversion }}%</strong></span>
          </div>
        </div>

        <!-- Finance Chart + At-Risk Students -->
        <div class="bottom-row">
          <div class="chart-card">
            <h4>Fee Collection Overview</h4>
            <canvas #feeChart></canvas>
          </div>

          <div class="risk-panel">
            <h4>🚨 High-Risk Students</h4>
            <div class="risk-list">
              <div class="risk-item" *ngFor="let s of data.atRiskStudents">
                <div class="risk-student-info">
                  <span class="risk-name">{{ s.name }}</span>
                  <span class="risk-dept">{{ s.department }}</span>
                </div>
                <div class="risk-metrics">
                  <span class="metric">📊 {{ s.attendancePercentage }}%</span>
                  <span class="metric">🎯 GPA {{ s.gpa }}</span>
                  <span class="badge" [ngClass]="s.riskStatus === 'Critical' ? 'critical' : 'high'">{{ s.riskStatus }}</span>
                </div>
              </div>
              <p class="empty-risk" *ngIf="!data.atRiskStudents.length">✅ No high-risk students!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .page { animation: fadeIn .4s ease; }
    @keyframes fadeIn { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
    .page-header { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.5rem; }
    .page-header h2 { margin:0;font-size:1.6rem;color:#1e293b; }
    .subtitle { color:#64748b;margin:.25rem 0 0;font-size:.9rem; }
    .btn-refresh { padding:.6rem 1.2rem;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;cursor:pointer;font-size:.9rem;color:#374151; }
    .btn-refresh:hover { background:#e2e8f0; }
    .loading-overlay { text-align:center;padding:4rem;color:#64748b; }
    .spinner { width:40px;height:40px;border:3px solid #e2e8f0;border-top:3px solid #6366f1;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 1rem; }
    @keyframes spin { to{transform:rotate(360deg)} }

    .kpi-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:1rem;margin-bottom:1.5rem; }
    .kpi-card { background:#fff;border-radius:14px;padding:1.25rem;display:flex;align-items:center;gap:1rem;box-shadow:0 2px 12px rgba(0,0,0,.07);transition:all .2s; }
    .kpi-card:hover { transform:translateY(-3px); }
    .kpi-icon { font-size:1.8rem; }
    .kpi-info { display:flex;flex-direction:column; }
    .kpi-val { font-size:1.5rem;font-weight:800;line-height:1; }
    .kpi-lbl { font-size:.72rem;color:#64748b;margin-top:.25rem;font-weight:500; }
    .indigo .kpi-val{color:#6366f1} .green .kpi-val{color:#10b981} .yellow .kpi-val{color:#f59e0b}
    .rose .kpi-val{color:#f43f5e} .purple .kpi-val{color:#a855f7} .teal .kpi-val{color:#14b8a6}
    .indigo { border-left:4px solid #6366f1; } .green { border-left:4px solid #10b981; }
    .yellow { border-left:4px solid #f59e0b; } .rose { border-left:4px solid #f43f5e; }
    .purple { border-left:4px solid #a855f7; } .teal { border-left:4px solid #14b8a6; }

    .charts-row { display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem;margin-bottom:1.5rem; }
    .chart-card { background:#fff;border-radius:14px;padding:1.25rem;box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .chart-card h4 { margin:0 0 1rem;font-size:.95rem;color:#1e293b;font-weight:600; }
    .chart-card canvas { max-height:220px; }

    .funnel-card { background:#fff;border-radius:14px;padding:1.5rem;box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:1.5rem; }
    .funnel-card h4 { margin:0 0 1rem;font-size:.95rem;color:#1e293b;font-weight:600; }
    .funnel { display:flex;flex-direction:column;gap:.5rem;align-items:center; }
    .funnel-step { transition:all .3s; }
    .funnel-bar { display:flex;justify-content:space-between;align-items:center;padding:.6rem 1rem;border-radius:8px;color:#fff;font-size:.88rem; }
    .funnel-bar strong { font-size:1.1rem; }
    .funnel-stats { display:flex;gap:2rem;margin-top:1rem;justify-content:center; }
    .funnel-stats span { font-size:.88rem;color:#64748b; }
    .funnel-stats strong { color:#6366f1; }

    .bottom-row { display:grid;grid-template-columns:1fr 1fr;gap:1.25rem; }
    @media(max-width:900px){ .bottom-row { grid-template-columns:1fr; } }

    .risk-panel { background:#fff;border-radius:14px;padding:1.25rem;box-shadow:0 2px 12px rgba(0,0,0,.07); }
    .risk-panel h4 { margin:0 0 1rem;font-size:.95rem;color:#1e293b;font-weight:600; }
    .risk-list { display:flex;flex-direction:column;gap:.75rem;max-height:280px;overflow-y:auto; }
    .risk-item { display:flex;justify-content:space-between;align-items:center;padding:.75rem;background:#f8fafc;border-radius:10px; }
    .risk-student-info { display:flex;flex-direction:column; }
    .risk-name { font-weight:600;font-size:.9rem;color:#1e293b; }
    .risk-dept { font-size:.78rem;color:#64748b; }
    .risk-metrics { display:flex;align-items:center;gap:.5rem;flex-wrap:wrap; }
    .metric { font-size:.78rem;color:#374151; }
    .badge { padding:.2rem .55rem;border-radius:20px;font-size:.72rem;font-weight:700; }
    .critical { background:#fef2f2;color:#dc2626; }
    .high { background:#fff7ed;color:#ea580c; }
    .empty-risk { color:#10b981;text-align:center;padding:1rem;font-weight:500; }
  `]
})
export class AnalyticsComponent implements OnInit, AfterViewInit {
  @ViewChild('deptChart') deptChartRef!: ElementRef;
  @ViewChild('riskChart') riskChartRef!: ElementRef;
  @ViewChild('lifecycleChart') lifecycleChartRef!: ElementRef;
  @ViewChild('feeChart') feeChartRef!: ElementRef;

  data: any = null;
  loading = true;
  charts: Chart[] = [];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() { this.loadData(); }
  ngAfterViewInit() {}

  loadData() {
    this.loading = true;
    this.analyticsService.getAll().subscribe({
      next: d => {
        this.data = d;
        this.loading = false;
        setTimeout(() => this.renderCharts(), 100);
      },
      error: () => this.loading = false
    });
  }

  private destroyCharts() { this.charts.forEach(c => c.destroy()); this.charts = []; }

  renderCharts() {
    this.destroyCharts();
    if (!this.data) return;

    // Department Chart
    if (this.deptChartRef) {
      const labels = this.data.byDepartment.map((d: any) => d._id || 'Unknown');
      const values = this.data.byDepartment.map((d: any) => d.count);
      this.charts.push(new Chart(this.deptChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels,
          datasets: [{ label: 'Students', data: values, backgroundColor: ['#6366f1','#8b5cf6','#a78bfa','#c4b5fd','#ddd6fe','#ede9fe'], borderRadius: 8, }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
      }));
    }

    // Risk Chart
    if (this.riskChartRef) {
      const riskMap: any = { Low: 0, Medium: 0, High: 0, Critical: 0 };
      this.data.byRisk.forEach((r: any) => { if (riskMap[r._id] !== undefined) riskMap[r._id] = r.count; });
      this.charts.push(new Chart(this.riskChartRef.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Low', 'Medium', 'High', 'Critical'],
          datasets: [{ data: [riskMap.Low, riskMap.Medium, riskMap.High, riskMap.Critical], backgroundColor: ['#10b981','#f59e0b','#f97316','#ef4444'], hoverOffset: 8 }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      }));
    }

    // Lifecycle Chart
    if (this.lifecycleChartRef) {
      const labels = this.data.byLifecycle.map((l: any) => l._id);
      const values = this.data.byLifecycle.map((l: any) => l.count);
      this.charts.push(new Chart(this.lifecycleChartRef.nativeElement, {
        type: 'pie',
        data: {
          labels,
          datasets: [{ data: values, backgroundColor: ['#6366f1','#22c55e','#f59e0b','#ec4899','#14b8a6'], hoverOffset: 8 }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      }));
    }

    // Fee Chart
    if (this.feeChartRef && this.data.finance?.length) {
      const feeMap: any = { Paid: 0, Pending: 0, Overdue: 0 };
      this.data.finance.forEach((f: any) => { if (feeMap[f._id] !== undefined) feeMap[f._id] = f.total; });
      this.charts.push(new Chart(this.feeChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Paid', 'Pending', 'Overdue'],
          datasets: [{ label: 'Amount (₹)', data: [feeMap.Paid, feeMap.Pending, feeMap.Overdue], backgroundColor: ['#10b981','#6366f1','#ef4444'], borderRadius: 8 }]
        },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
      }));
    }
  }
}
