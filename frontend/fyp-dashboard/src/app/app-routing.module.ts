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
import { FormComponent } from './components/form/form.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthGuard] },
  { path: 'realtime', component: RealtimeComponent, canActivate: [AuthGuard] },
  { path: 'behavior', component: BehaviorComponent, 
    children: [
      { path: 'pages',    component: PagesComponent },
      { path: 'events',   component: EventsComponent },
      { path: 'visitors', component: VisitorsComponent },
      { path: 'sessions', component: SessionsComponent },
      { path: 'traffic', component: TrafficComponent },
      { path: '', redirectTo: 'pages', pathMatch: 'full' }
    ]
  },
  { path: 'e-commerce', component: EcommerceComponent, canActivate: [AuthGuard] },
  { path: 'ai', component: AiComponent, canActivate: [AuthGuard] },
  { path: 'custom', component: CustomComponent, canActivate: [AuthGuard] },
  { path: 'form', component: FormComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}