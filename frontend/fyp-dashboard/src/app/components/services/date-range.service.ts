import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DateRange {
  start: Date | null;
  end:   Date | null;
}

@Injectable({ providedIn: 'root' })
export class DateRangeService {
  private rangeSubject = new BehaviorSubject<DateRange>({ start: null, end: null });
  readonly range$ = this.rangeSubject.asObservable();

  setRange(range: DateRange) {
    this.rangeSubject.next(range);
  }
}
