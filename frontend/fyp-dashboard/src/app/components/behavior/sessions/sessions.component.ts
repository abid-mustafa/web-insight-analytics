import { Component, OnInit } from '@angular/core';
import { DateRangeService } from '../../services/date-range.service';

interface TableConfig {
  title: string;
  endpoint: string;
}

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  sessionTables: TableConfig[] = [
    { title: 'Session Stat 1', endpoint: '' },
    { title: 'Session Stat 2', endpoint: '' },
    { title: 'Session Stat 3', endpoint: '' },
    { title: 'Session Stat 4', endpoint: '' },
    { title: 'Session Stat 5', endpoint: '' },
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