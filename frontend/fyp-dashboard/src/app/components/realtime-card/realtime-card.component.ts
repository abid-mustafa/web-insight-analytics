import { Component, Input, input, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { ApiService } from '../services/api.service';
import { WebsiteService } from '../services/website.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-realtime-card',
  templateUrl: './realtime-card.component.html',
  styleUrls: ['./realtime-card.component.scss'],
})
export class RealtimeCardComponent implements OnInit {
  @Input() title!: string;
  @Input() event!: string;

  // Tracks selected website
  private currentWebsiteId: string = '';

  // For unsubscribing
  private destroy$ = new Subject<void>();

  value: number = 0;

  constructor(private socketService: SocketService, private apiService: ApiService, private websiteService: WebsiteService) { }

  ngOnInit(): void {
    // Listen for website changes
    this.websiteService.selectedWebsite$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.currentWebsiteId = id;
        // clear out old data
        if (id) {
          this.fetchData();
        }
      });

    // live updates
    this.socketService.listenForEvent(this.event).subscribe((val: number) => {
      this.value = val;
    });
  }

  fetchData() {
    if (!this.currentWebsiteId) {
      console.error('Website ID missing or not authenticated');
      return;
    }

    this.apiService.getRealtimeData(this.event, this.currentWebsiteId).subscribe({
      next: (res: any) => {
        if (res) {
          this.value = res.value;
        }
      },
      error: (err) => {
        console.error('Error fetching initial data:', err);
      }
    });
  }
}