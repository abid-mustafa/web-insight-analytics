import { Component, OnInit } from '@angular/core';
import { DateRangeService } from '../../services/date-range.service';

interface TableConfig {
  title: string;
  endpoint: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit {
  eventTables: TableConfig[] = [
    { title: 'Event Stat 1', endpoint: '' },
    { title: 'Event Stat 2', endpoint: '' },
    { title: 'Event Stat 3', endpoint: '' },
    { title: 'Event Stat 4', endpoint: '' },
    { title: 'Event Stat 5', endpoint: '' },
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