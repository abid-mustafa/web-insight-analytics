import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OverviewComponent } from './components/overview/overview.component';
import { RealtimeComponent } from './components/realtime/realtime.component';
import { BehaviorComponent } from './components/behavior/behavior.component';
import { EventsComponent } from './components/behavior/events/events.component';
import { PagesComponent } from './components/behavior/pages/pages.component';
import { VisitorsComponent } from './components/behavior/visitors/visitors.component';
import { SessionsComponent } from './components/behavior/sessions/sessions.component';
import { TrafficComponent } from './components/behavior/traffic/traffic.component';
import { AuthGuard } from './components/services/auth-guard.guard';
import { EcommerceComponent } from './components/e-commerce/e-commerce.component';
import { AiComponent } from './components/ai/ai.component';
import { CustomComponent } from './components/custom/custom.component';
import { WebsiteFormComponent } from './components/website-form/website-form.component';
import { WebsiteManagementComponent } from './components/website-management/website-management.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Web Insight | Login' },
  { path: 'register', component: RegisterComponent, title: 'Web Insight | Register' },
  {
    path: 'overview', title: 'Web Insight | Overview',
    component: OverviewComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
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
    component: BehaviorComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true },
    children: [
      { path: 'pages', component: PagesComponent, title: 'Web Insight | Pages' },
      { path: 'events', component: EventsComponent, title: 'Web Insight | Events' },
      { path: 'visitors', component: VisitorsComponent, title: 'Web Insight | Visitors' },
      { path: 'sessions', component: SessionsComponent, title: 'Web Insight | Sessions' },
      { path: 'traffic', component: TrafficComponent, title: 'Web Insight | Traffic' },
      { path: '', redirectTo: 'pages', pathMatch: 'full' },
    ],
  },
  {
    path: 'e-commerce', title: 'Web Insight | E-Commerce',
    component: EcommerceComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
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
