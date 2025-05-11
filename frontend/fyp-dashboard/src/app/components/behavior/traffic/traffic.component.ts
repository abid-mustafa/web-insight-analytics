import { Component, OnInit } from '@angular/core';
import { DateRangeService } from '../../services/date-range.service';

interface TableConfig {
  title: string;
  endpoint: string;
}

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss'],
})
export class TrafficComponent implements OnInit {
  trafficTables: TableConfig[] = [
    { title: 'Traffic Stat 1', endpoint: '' },
    { title: 'Traffic Stat 2', endpoint: '' },
    { title: 'Traffic Stat 3', endpoint: '' },
    { title: 'Traffic Stat 4', endpoint: '' },
    { title: 'Traffic Stat 5', endpoint: '' },
  ];

  fromDate = '';
  toDate = '';

  constructor(private dateRangeService: DateRangeService) {}

  ngOnInit(): void {
    this.dateRangeService.range$.subscribe(({ start, end }) => {
      if (start && end) {
        this.fromDate = start.toISOString().split('T')[0];
        this.toDate = end.toISOString().split('T')[0];
      }
    });
  }
}