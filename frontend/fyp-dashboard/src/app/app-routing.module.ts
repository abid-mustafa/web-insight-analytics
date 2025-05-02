import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './components/pages/overview/overview.component';
import { RealtimeComponent } from './components/pages/realtime/realtime.component';

const routes: Routes = [
  { path: 'overview', component: OverviewComponent, title: 'Web Insight | Overview' },
  { path: 'realtime', component: RealtimeComponent, title: 'Web Insight | Realtime' },
  { path: '**', redirectTo: 'overview' } // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
