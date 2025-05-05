import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DateRangeService, DateRange } from '../services/date-range.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end:   new FormControl<Date | null>(null),
  });

  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private dateRangeService: DateRangeService) {}

  ngOnInit(): void {
    this.range.valueChanges
      .subscribe((val: Partial<DateRange>) => {
        const { start, end } = val;
        if (start && end) {
          this.dateRangeService.setRange({ start, end });
        }
      });
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
