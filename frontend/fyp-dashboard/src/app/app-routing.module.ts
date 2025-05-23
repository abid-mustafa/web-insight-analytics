import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './services/auth-guard.guard';
import { AiComponent } from './components/ai/ai.component';
import { CustomComponent } from './components/custom/custom.component';
import { WebsiteFormComponent } from './components/website-form/website-form.component';
import { WebsiteManagementComponent } from './components/website-management/website-management.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { overviewDashboard } from './dashboard-config/overview-dashboard-config';
import { pagesDashboard } from './dashboard-config/pages-dashboard.config';
import { eventsDashboard } from './dashboard-config/events-dashboard.config';
import { visitorsDashboard } from './dashboard-config/visitor-dashboard-config';
import { sessionsDashboard } from './dashboard-config/sessions-dashboard-config';
import { trafficDashboard } from './dashboard-config/traffic-dashboard-config';
import { ecommerceDashboard } from './dashboard-config/e-commerce-dashboard-config';
import { RealtimeComponent } from './components/realtime/realtime.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Web Insight | Login' },
  { path: 'register', component: RegisterComponent, title: 'Web Insight | Register' },
  {
    path: 'overview', title: 'Web Insight | Overview',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true, dashboard: overviewDashboard }
  },
  {
    path: 'realtime', title: 'Web Insight | Realtime',
    component: RealtimeComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  {
    path: 'behavior', title: 'Web Insight | Behavior',
    // Lazy load the BehaviorComponent and its children
    canActivate: [AuthGuard],
    data: { requiresAuth: true },
    children: [
      { path: 'pages', component: DashboardComponent, title: 'Web Insight | Pages', data: { dashboard: pagesDashboard } },
      { path: 'events', component: DashboardComponent, title: 'Web Insight | Events', data: { dashboard: eventsDashboard } },
      { path: 'visitors', component: DashboardComponent, title: 'Web Insight | Visitors', data: { dashboard: visitorsDashboard } },
      { path: 'sessions', component: DashboardComponent, title: 'Web Insight | Sessions', data: { dashboard: sessionsDashboard } },
      { path: 'traffic', component: DashboardComponent, title: 'Web Insight | Traffic', data: { dashboard: trafficDashboard } },
      { path: '', redirectTo: 'pages', pathMatch: 'full' },
    ],
  },
  {
    path: 'e-commerce', title: 'Web Insight | E-Commerce',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true, dashboard: ecommerceDashboard }
  },
  {
    path: 'ai', title: 'Web Insight | AI',
    component: AiComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  {
    path: 'custom', title: 'Web Insight | Custom',
    component: CustomComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  {
    path: 'website-form', title: 'Web Insight | Website Form',
    component: WebsiteFormComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  {
    path: 'manage-websites', title: 'Web Insight | Manage Websites',
    component: WebsiteManagementComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: '**', redirectTo: 'overview' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload',
    paramsInheritanceStrategy: 'always',
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
