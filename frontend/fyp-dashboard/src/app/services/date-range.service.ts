import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Injectable({ providedIn: 'root' })
export class DateRangeService {
  private static loadInitialRange(): DateRange {
    return {
      start: localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')!) : null,
      end: localStorage.getItem('endDate') ? new Date(localStorage.getItem('endDate')!) : null,
    };
  }

  private rangeSubject = new BehaviorSubject<DateRange>(DateRangeService.loadInitialRange());
  readonly range$ = this.rangeSubject.asObservable();

  setRange(range: DateRange): void {
    this.rangeSubject.next(range);
  }

  getCurrentRange(): DateRange {
    return this.rangeSubject.getValue();
  }
}