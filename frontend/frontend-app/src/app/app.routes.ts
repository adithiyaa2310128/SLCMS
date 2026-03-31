import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard.component';
import { StudentsComponent } from './pages/students.component';
import { AttendanceComponent } from './pages/attendance.component';
import { MarksComponent } from './pages/marks.component';
import { AlumniComponent } from './pages/alumni.component';
import { ChatComponent } from './pages/chat.component';

// New Modules
import { LeadsComponent } from './pages/leads.component';
import { AdmissionsComponent } from './pages/admissions.component';
import { AcademicsComponent } from './pages/academics.component';
import { ExamsComponent } from './pages/exams.component';
import { FinanceComponent } from './pages/finance.component';
import { CampusComponent } from './pages/campus.component';
import { PlacementsComponent } from './pages/placements.component';
import { AnnouncementsComponent } from './pages/announcements.component';
import { AnalyticsComponent } from './pages/analytics.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      // Lead & Admission
      { path: 'leads', component: LeadsComponent },
      { path: 'admissions', component: AdmissionsComponent },
      // Students & Attendance
      { path: 'students', component: StudentsComponent },
      { path: 'attendance', component: AttendanceComponent },
      // Academics
      { path: 'academics', component: AcademicsComponent },
      { path: 'exams', component: ExamsComponent },
      { path: 'marks', component: MarksComponent },
      // Finance
      { path: 'finance', component: FinanceComponent },
      // Campus
      { path: 'campus', component: CampusComponent },
      // Communication
      { path: 'announcements', component: AnnouncementsComponent },
      { path: 'chat/:room', component: ChatComponent },
      // Placement & Alumni
      { path: 'placements', component: PlacementsComponent },
      { path: 'alumni', component: AlumniComponent },
      // Analytics
      { path: 'analytics', component: AnalyticsComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
