import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard.component';
import { AttendanceComponent } from './pages/attendance.component';
import { StudentsComponent } from './pages/students.component';
import { MarksComponent } from './pages/marks.component';
import { AlumniComponent } from './pages/alumni.component';
import { ChatComponent } from './pages/chat.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'students', component: StudentsComponent },
      { path: 'marks', component: MarksComponent },
      { path: 'alumni', component: AlumniComponent },
      { path: 'chat/:room', component: ChatComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
