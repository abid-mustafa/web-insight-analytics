import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() dateRangeChanged = new EventEmitter<{ fromDate: string, toDate: string }>();

  fromDate: string;
  toDate: string;

  constructor() {
    // Load saved dates from localStorage or set defaults
    this.fromDate = localStorage.getItem('fromDate') || '2024-10-01';
    this.toDate = localStorage.getItem('toDate') || new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.emitDateChange(); // Ensure saved date is applied at startup
  }

  onFromDateChange() {
    if (new Date(this.fromDate) > new Date(this.toDate)) {
      this.toDate = this.fromDate; // Prevent "Up To" date from being earlier
    }
    this.saveDateRange();
  }

  onToDateChange() {
    if (new Date(this.toDate) < new Date(this.fromDate)) {
      this.fromDate = this.toDate; // Prevent "From" date from being later
    }
    this.saveDateRange();
  }

  saveDateRange() {
    localStorage.setItem('fromDate', this.fromDate);
    localStorage.setItem('toDate', this.toDate);
    this.emitDateChange();
  }

  emitDateChange() {
    this.dateRangeChanged.emit({ fromDate: this.fromDate, toDate: this.toDate });
  }
}