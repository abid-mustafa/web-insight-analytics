import { Component, Input, input, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-realtime-card',
  templateUrl: './realtime-card.component.html',
  styleUrls: ['./realtime-card.component.scss'],
})
export class RealtimeCardComponent implements OnInit {
  @Input() title!: string;
  @Input() event!: string;

  value: number = 0;

  constructor(private socketService: SocketService, private apiService: ApiService) { }

  ngOnInit(): void {
    const websiteUid = JSON.parse(localStorage.getItem('websiteUid') || '0');

    this.apiService.getRealtimeData(this.event, websiteUid).subscribe({
      next: (res: any) => {
        if (res) {
          this.value = res.value;
        }
      },
      error: (err) => {
        console.error('Error fetching initial data:', err);
      }
    });

    // live updates
    this.socketService.listenForEvent(this.event).subscribe((val: number) => {
      this.value = val;
    });
  }
}