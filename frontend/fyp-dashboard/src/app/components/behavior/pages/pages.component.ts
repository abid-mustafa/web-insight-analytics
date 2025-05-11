import { Component, OnInit } from '@angular/core';
import { DateRangeService } from '../../services/date-range.service';

interface TableConfig {
  title: string;
  endpoint: string;
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  pageTables: TableConfig[] = [
    { title: 'Page Stat 1', endpoint: '' },
    { title: 'Page Stat 2', endpoint: '' },
    { title: 'Page Stat 3', endpoint: '' },
    { title: 'Page Stat 4', endpoint: '' },
    { title: 'Page Stat 5', endpoint: '' },
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