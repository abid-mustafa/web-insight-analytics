import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }     from './components/login/login.component';
import { RegisterComponent }  from './components/register/register.component';
import { OverviewComponent }  from './components/pages/overview/overview.component';
import { RealtimeComponent }  from './components/pages/realtime/realtime.component';

const routes: Routes = [
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'realtime', component: RealtimeComponent },
  { path: '',         redirectTo: 'login', pathMatch: 'full' },
  { path: '**',       redirectTo: 'login' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
