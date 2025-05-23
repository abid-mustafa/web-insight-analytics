import { Component, Input } from '@angular/core';
import { DashboardGridItem } from '../../dashboard-config/dashboard-grid-item.interface';
import { Subject, takeUntil } from 'rxjs';
import { DateRangeService } from '../../services/date-range.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @Input() items!: DashboardGridItem[];
  fromDate: string = '';
  toDate: string = '';

  private destroy$ = new Subject<void>();

  constructor(private dateRangeService: DateRangeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // If items not provided as input, get from route data
    if (!this.items) {
      this.items = this.route.snapshot.data['dashboard'];
    }

    // Subscribe to date range changes
    this.dateRangeService.range$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ start, end }) => {
        if (start && end) {
          this.fromDate = start.toISOString();
          this.toDate = end.toISOString();

          console.log(this.fromDate, this.toDate);

        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
