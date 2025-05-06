import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }     from './components/login/login.component';
import { RegisterComponent }  from './components/register/register.component';
import { OverviewComponent }  from './components/overview/overview.component';
import { RealtimeComponent }  from './components/realtime/realtime.component';
import { AuthGuard } from './components/services/auth-guard.guard';

const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthGuard] },
  { path: 'realtime', component: RealtimeComponent, canActivate: [AuthGuard]  },
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: '**',       redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
