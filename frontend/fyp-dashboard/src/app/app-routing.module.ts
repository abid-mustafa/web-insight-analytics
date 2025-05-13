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
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'overview', 
    component: OverviewComponent, 
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  { 
    path: 'realtime', 
    component: RealtimeComponent, 
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  {
    path: 'behavior',
    component: BehaviorComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true },
    children: [
      { path: 'pages', component: PagesComponent },
      { path: 'events', component: EventsComponent },
      { path: 'visitors', component: VisitorsComponent },
      { path: 'sessions', component: SessionsComponent },
      { path: 'traffic', component: TrafficComponent },
      { path: '', redirectTo: 'pages', pathMatch: 'full' },
    ],
  },
  {
    path: 'e-commerce',
    component: EcommerceComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  { 
    path: 'ai', 
    component: AiComponent, 
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  { 
    path: 'custom', 
    component: CustomComponent, 
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  {
    path: 'website-form',
    component: WebsiteFormComponent,
    canActivate: [AuthGuard],
    data: { requiresAuth: true }
  },
  {
    path: 'manage-websites',
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
export class AppRoutingModule {}
