import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { RealtimeComponent } from './components/pages/realtime/realtime.component';
import { AnalyticsComponent } from './components/pages/analytics/analytics.component';
import { UsersComponent } from './components/pages/users/users.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { HelpComponent } from './components/pages/help/help.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'realtime', component: RealtimeComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'help', component: HelpComponent },
  { path: '**', redirectTo: 'dashboard' } // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
