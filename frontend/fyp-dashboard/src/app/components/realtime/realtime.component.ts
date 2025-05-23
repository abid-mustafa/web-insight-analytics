import { Component, OnInit } from '@angular/core';
import { realtimeDashboard } from '../../dashboard-config/realtime-dashboard-config';
import { DashboardGridItem } from '../../dashboard-config/dashboard-grid-item.interface';

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss'],
})
export class RealtimeComponent implements OnInit {
  items: DashboardGridItem[] = realtimeDashboard;

  ngOnInit(): void { }
}