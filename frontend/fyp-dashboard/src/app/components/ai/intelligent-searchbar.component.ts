import { Component, OnDestroy } from '@angular/core';
import { AiService } from '../../services/ai.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ai-page',
  templateUrl: './intelligent-searchbar.component.html',
  styleUrls: ['./intelligent-searchbar.component.scss'],
})
export class IntelligentSearchbarComponent implements OnDestroy {
  userInput = '';
  submitted = false;
  aiOutput: any;
  displayedColumns: string[] = [];
  tableData: any[] = [];
  searchbarIsLoading = false;
  error = '';
  fromDate = '';
  toDate = '';
  private destroy$ = new Subject<void>();

  constructor(private aiService: AiService) { }

  onSubmit(): void {
    const websiteUid = JSON.parse(localStorage.getItem('websiteUid') || 'null');
    if (!websiteUid || !this.userInput.trim()) return;

    this.submitted = true;
    this.searchbarIsLoading = true;

    this.aiService
      .getIntelligentSearchBarResponse(websiteUid, this.userInput)
      .subscribe({
        next: (response) => {
          this.aiOutput = response;
          if (response.prompt_type === 'query' && response.values?.length) {
            this.displayedColumns = Object.keys(response.values[0]);
            this.tableData = response.values;
          } else {
            this.displayedColumns = [];
            this.tableData = [];
          }
          this.searchbarIsLoading = false;
          this.userInput = '';
        },
        error: () => {
          this.aiOutput = 'An error occurred while fetching the AI response.';
          this.displayedColumns = [];
          this.tableData = [];
          this.searchbarIsLoading = false;
          this.userInput = '';
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}