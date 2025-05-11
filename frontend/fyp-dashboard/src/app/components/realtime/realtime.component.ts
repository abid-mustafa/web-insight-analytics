import { Component, OnInit } from '@angular/core';

interface RealtimeCardConfig {
  title: string;
  endpoint: string;
  event: string;
}

@Component({
  selector: 'app-realtime',
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss'],
})
export class RealtimeComponent implements OnInit {
  cards: RealtimeCardConfig[] = [
    { title: 'Pageviews', endpoint: 'pageviews', event: 'get_pageviews' },
    { title: 'Events', endpoint: 'events', event: 'get_events' },
    { title: 'Users', endpoint: 'users', event: 'get_users' },
    { title: 'Sessions', endpoint: 'sessions', event: 'get_sessions' },
  ];

  ngOnInit(): void {}
}