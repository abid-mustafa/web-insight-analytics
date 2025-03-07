import { Component } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-realtime',
  standalone: false,
  templateUrl: './realtime.component.html',
  styleUrls: ['./realtime.component.scss']  // Note: Use styleUrls (plural)
})
export class RealtimeComponent {
  pageviews: number = 0;
  events: number = 0;
  users: number = 0;

  constructor(private socketService: SocketService, private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getRealtimeData().subscribe((data: any) => {
      console.log('Realtime data:', data);
      this.pageviews = data.metric_value;
    });

    this.socketService.listenForEvent('get_pageviews').subscribe((data: any) => {
      console.log('Received pageviews:', data);
      this.pageviews = data;
    });
    this.socketService.listenForEvent('get_events').subscribe((data: any) => {
      console.log('Received events:', data);
      this.events = data;
    });
    this.socketService.listenForEvent('get_users').subscribe((data: any) => {
      console.log('Received users:', data);
      this.users = data;
    });
  }
}
