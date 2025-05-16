import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Injectable({ providedIn: 'root' })
export class DateRangeService {
  private rangeSubject = new BehaviorSubject<DateRange>({
    start: localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')!) : null,
    end: localStorage.getItem('endDate') ? new Date(localStorage.getItem('endDate')!) : null,
  });
  readonly range$ = this.rangeSubject.asObservable();
  setRange(range: DateRange) {
    this.rangeSubject.next(range);
  }
}