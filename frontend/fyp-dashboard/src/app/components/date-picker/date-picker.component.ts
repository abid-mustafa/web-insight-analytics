import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DateRangeService } from '../../services/date-range.service';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss'
})
export class DatePickerComponent {

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  private destroy$ = new Subject<void>();

  constructor(private dateRangeService: DateRangeService) { }

  ngOnInit() {
    const { start, end } = this.dateRangeService.getCurrentRange();


    if (!start || !end) {
      const today = new Date();
      const defaultStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate() - 7, 0, 0, 0, 0));
      const defaultEnd = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));

      this.dateRangeService.setRange({ start: defaultStart, end: defaultEnd });
      localStorage.setItem('startDate', defaultStart.toISOString());
      localStorage.setItem('endDate', defaultEnd.toISOString());
      this.range.setValue({ start: defaultStart, end: defaultEnd });
    } else {
      this.range.setValue({ start, end });
    }

    this.range.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
      const { start, end } = val;
      if (start && end) {
        const normalizedStart = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0));
        const normalizedEnd = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999));

        if (normalizedStart > normalizedEnd) {
          this.range.setErrors({ invalidRange: true });
          return;
        }

        localStorage.setItem('startDate', normalizedStart.toISOString());
        localStorage.setItem('endDate', normalizedEnd.toISOString());
        this.dateRangeService.setRange({ start: normalizedStart, end: normalizedEnd });
      } else {
        this.range.setErrors({ invalidRange: true });
      }
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
