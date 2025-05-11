import { Component, OnInit } from '@angular/core';
import {
  GridsterConfig,
  GridsterItem,
  GridType,
  DisplayGrid,
} from 'angular-gridster2';
import { DateRangeService } from '../services/date-range.service';

interface EcommerceGridItem extends GridsterItem {
  endpoint: string;
  title: string;
  displayType: 'summary' | 'table' | 'realtime';
  event?: string;
}

@Component({
  selector: 'app-ecommerce-page',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss'],
})
export class EcommerceComponent implements OnInit {
  options!: GridsterConfig;
  dashboard: EcommerceGridItem[] = [
    {
      cols: 2,
      rows: 1,
      x: 0,
      y: 0,
      endpoint: 'ecommerce/sales',
      title: 'Total Sales',
      displayType: 'summary',
    },
    {
      cols: 1,
      rows: 1,
      x: 2,
      y: 0,
      endpoint: 'ecommerce/orders',
      title: 'Orders',
      displayType: 'summary',
    },
    {
      cols: 1,
      rows: 1,
      x: 0,
      y: 1,
      endpoint: 'ecommerce/top-products',
      title: 'Top Products',
      displayType: 'table',
    },
    {
      cols: 1,
      rows: 1,
      x: 1,
      y: 1,
      endpoint: 'ecommerce/returns',
      title: 'Returns',
      displayType: 'table',
    },
    {
      cols: 1,
      rows: 1,
      x: 2,
      y: 1,
      endpoint: 'ecommerce/inventory',
      title: 'Inventory',
      displayType: 'table',
    },
  ];

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