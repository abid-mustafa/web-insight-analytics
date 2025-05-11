import { Component, OnInit } from '@angular/core';
import { DateRangeService } from '../../services/date-range.service';

interface TableConfig {
  title: string;
  endpoint: string;
}

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.component.html',
  styleUrls: ['./visitors.component.scss'],
})
export class VisitorsComponent implements OnInit {
  pageTables: TableConfig[] = [
    { title: 'Visitor Stat 1', endpoint: '' },
    { title: 'Visitor Stat 2', endpoint: '' },
    { title: 'Visitor Stat 3', endpoint: '' },
    { title: 'Visitor Stat 4', endpoint: '' },
    { title: 'Visitor Stat 5', endpoint: '' },
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