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
  @Input() endpoint!: string;
  @Input() event!: string;

  value: number = 0;

  constructor(
    private socketService: SocketService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // initial fetch
    // this.apiService.getRealtimeData().subscribe((data: any) => {
    //   // adjust this to match your payload shape
    //   this.activeUsers = data.users ?? 0;
    // });

    // live updates
    this.socketService.listenForEvent(this.event).subscribe((val: number) => {
      this.value = val;
    });
  }
}