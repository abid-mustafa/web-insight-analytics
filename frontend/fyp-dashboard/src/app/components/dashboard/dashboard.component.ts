import { Component, Input } from '@angular/core';
import { DashboardGridItem } from '../dashboard-config/dashboard-grid-item.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() items!: DashboardGridItem[];
  @Input() fromDate!: string;
  @Input() toDate!: string;
}
