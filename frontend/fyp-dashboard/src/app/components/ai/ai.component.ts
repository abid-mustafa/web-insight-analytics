import { Component, OnDestroy, OnInit } from '@angular/core';
import { AiService } from '../../services/ai.service';
import { Subject, takeUntil } from 'rxjs';
import { DateRangeService } from '../../services/date-range.service';

@Component({
  selector: 'app-ai-page',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss'],
})
export class AiComponent implements OnInit, OnDestroy {
  userInput: string = '';
  submitted: boolean = false;
  aiOutput: any;
  displayedColumns: string[] = [];
  tableData: any[] = [];
  searchbarIsLoading: boolean = false;
  reportIsLoading: string = '';
  generatedReportResponse: string = '';
  error: string = '';
  fromDate: string = '';
  toDate: string = '';
  private destroy$ = new Subject<void>();

  constructor(private aiService: AiService, private dateRangeService: DateRangeService) { }

  ngOnInit(): void {
    // Subscribe to date range changes
    this.dateRangeService.range$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ start, end }) => {
        if (start && end) {
          this.fromDate = start.toISOString();
          this.toDate = end.toISOString();
        }
      });
  }

  onSubmit(): void {
    // Only show the response section once user clicks Submit
    this.submitted = true;
    if (this.userInput.trim() === '') {
      return; // Prevent submission if input is empty or whitespace
    }
    const websiteUid = JSON.parse(localStorage.getItem('websiteUid') || ' ');
    if (!websiteUid) {
      console.error('Website UID not found in local storage');
      return;
    }
    this.searchbarIsLoading = true;
    this.aiService
      .getIntelligentSearchBarResponse(websiteUid, this.userInput)
      .subscribe({
        next: (response) => {
          console.log(response);

          if (response.prompt_type === 'general_question') {
            this.aiOutput = response;
            this.tableData = [];
            this.displayedColumns = [];
          } else if (response.prompt_type === 'query') {
            this.aiOutput = response;
            if (response.values && response.values.length > 0) {
              this.displayedColumns = Object.keys(response.values[0]);
              this.tableData = response.values;
            }
          }
          this.searchbarIsLoading = false;
          this.userInput = '';
        },
        error: (error) => {
          console.error('Error fetching AI response:', error);
          this.aiOutput = 'An error occurred while fetching the AI response.';
          this.tableData = [];
          this.displayedColumns = [];
          this.searchbarIsLoading = false;
          this.userInput = '';
        }
      });
  }

  getAIReport(): void {
    const websiteUid = JSON.parse((localStorage.getItem('websiteUid') || 'null'));
    if (!websiteUid) {
      this.error = 'Website UID not found';
      return;
    }
    this.reportIsLoading = 'Please wait while report is being generated...';
    this.aiService
      .getAIGeneratedReport(websiteUid, this.fromDate, this.toDate)
      .subscribe({
        next: (response) => {
          this.generatedReportResponse = response.message;
          this.reportIsLoading = '';
        },
        error: (err) => {
          this.error = 'Failed to load AI report';
          this.generatedReportResponse = err.error?.message;
          this.reportIsLoading = '';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
