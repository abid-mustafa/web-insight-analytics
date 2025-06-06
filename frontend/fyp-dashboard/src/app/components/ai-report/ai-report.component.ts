import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AiService } from '../../services/ai.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { WebsiteService } from '../../services/website.service';

// Custom validator for date range
const dateRangeValidator: ValidatorFn = (group: AbstractControl) => {
  const start = group.get('start')?.value;
  const end = group.get('end')?.value;
  if (start && end && new Date(start) > new Date(end)) {
    return { invalidRange: true };
  }
  return null;
};

@Component({
  selector: 'app-ai-report',
  templateUrl: './ai-report.component.html',
  styleUrl: './ai-report.component.scss'
})
export class AiReportComponent implements OnInit, OnDestroy {
  reportIsLoading = '';
  generatedReportResponse = '';
  error = '';
  fromDate = '';
  toDate = '';
  websites: any = []
  readonly formData = new FormGroup({
    start: new FormControl<Date | null>(null, Validators.required),
    end: new FormControl<Date | null>(null, Validators.required),
    selectedWebsite: new FormControl<string | null>(null, Validators.required),
  }, { validators: dateRangeValidator });
  private destroy$ = new Subject<void>();

  selectedWebsite: string | null = null;

  constructor(private aiService: AiService, private websiteService: WebsiteService) { }

  ngOnInit(): void {
    this.websiteService.getWebsites().subscribe({
      next: (res: any) => {
        const arr = Array.isArray(res) ? res : res.data;
        this.websites = Array.isArray(arr) ? arr : [];
      },
    });
  }

  getAIReport(): void {
    this.error = '';
    this.generatedReportResponse = '';

    if (this.formData.invalid) {
      if (this.formData.hasError('invalidRange')) {
        this.error = 'Start date must not be after end date.';
      } else {
        this.error = 'Please fill all fields.';
      }
      return;
    }

    const { start, end, selectedWebsite } = this.formData.value;

    if (!start || !end || !selectedWebsite) {
      this.error = 'Please fill all fields.';
      return;
    }

    const startStr = start.toISOString();
    const endStr = end.toISOString();

    this.reportIsLoading = 'Please wait while report is being generated...';

    this.aiService.getAIGeneratedReport(selectedWebsite, startStr, endStr)
      .subscribe({
        next: (response) => {
          this.generatedReportResponse = response.message;
          this.reportIsLoading = '';
        },
        error: (err) => {
          this.error = 'Failed to load AI report';
          this.generatedReportResponse = err.error?.message;
          this.reportIsLoading = '';
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}