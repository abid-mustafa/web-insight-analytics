import { Component, OnInit } from '@angular/core';
import { AiService } from '../services/ai.service';
import { DateRangeService } from '../services/date-range.service';

@Component({
  selector: 'app-ai-page',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss'],
})
export class AiComponent implements OnInit {
  userInput: string = '';
  submitted: boolean = false;
  aiOutput: any;
  displayedColumns: string[] = [];
  tableData: any[] = [];
  isLoading: boolean = false;
  generatedReportResponse: string = '';
  error: string = '';
  dateRange = {
    fromDate: '2020-11-01',
    toDate: '2020-11-30',
  };

  constructor(private aiService: AiService, private dateRangeService: DateRangeService) { }

  ngOnInit(): void {
    this.dateRangeService.range$.subscribe(({ start, end }) => {
      if (start && end) {
        this.dateRange = {
          fromDate: start.toISOString().split('T')[0],
          toDate: end.toISOString().split('T')[0],
        };
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
    this.isLoading = true;
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
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching AI response:', error);
          this.aiOutput = 'An error occurred while fetching the AI response.';
          this.tableData = [];
          this.displayedColumns = [];
          this.isLoading = false;
        }
      });
  }

  getAIReport(): void {
    const websiteUid = JSON.parse((localStorage.getItem('websiteUid') || 'null'));
    if (!websiteUid) {
      this.error = 'Website UID not found';
      return;
    }
    this.isLoading = true;
    this.aiService
      .getAIGeneratedReport(websiteUid, this.dateRange.fromDate, this.dateRange.toDate)
      .subscribe({
        next: (response) => {
          this.generatedReportResponse = response.message;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Failed to load AI report';
          this.generatedReportResponse = err.error;
          this.isLoading = false;
        }
      });
  }
}
