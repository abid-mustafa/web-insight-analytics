import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Injectable({ providedIn: 'root' })
export class DateRangeService {
  private rangeSubject = new BehaviorSubject<DateRange>({
    start: new Date('2020-11-01'),
    end: new Date('2020-11-07'),
  });
  readonly range$ = this.rangeSubject.asObservable();
  setRange(range: DateRange) {
    this.rangeSubject.next(range);
  }
}