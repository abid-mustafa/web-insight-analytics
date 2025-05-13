import { Component, OnInit } from '@angular/core';
import {
  GridsterConfig,
  GridType,
  DisplayGrid,
} from 'angular-gridster2';
import { DateRangeService } from '../services/date-range.service';
import {ecommerceDashboard } from '../dashboard-config/e-commerce-dashboard-config';
import { DashboardGridItem } from '../dashboard-config/dashboard-grid-item.interface';

@Component({
  selector: 'app-ecommerce-page',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss'],
})
export class EcommerceComponent implements OnInit {
  options!: GridsterConfig;
  dashboard: DashboardGridItem[] = ecommerceDashboard;

  fromDate = '2020-11-01';
  toDate = '2020-11-07';

  constructor(private dateRangeService: DateRangeService) {}

  ngOnInit(): void {
    this.options = {
      gridType: GridType.ScrollVertical,
      displayGrid: DisplayGrid.OnDragAndResize,
      draggable: { enabled: true },
      itemChangeCallback: this.onItemChange.bind(this),
    };

    this.dateRangeService.range$.subscribe(({ start, end }) => {
      if (start && end) {
        this.fromDate = start.toISOString().slice(0, 10);
        this.toDate = end.toISOString().slice(0, 10);
      }
    });
  }

  onItemChange(): void {
    localStorage.setItem('ecommerceDashboard', JSON.stringify(this.dashboard));
  }
}