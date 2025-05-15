import { Component } from '@angular/core';
import { AiService } from '../services/ai.service';

@Component({
  selector: 'app-ai-page',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss'],
})
export class AiComponent {
  userInput: string = '';
  submitted: boolean = false;
  aiOutput: any;
  displayedColumns: string[] = [];
  tableData: any[] = [];
  isLoading: boolean = false;

  constructor(private aiService: AiService) { }

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
    this.aiService.getIntelligentSearchBarResponse(websiteUid, this.userInput).subscribe((response) => {
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
    }, (error) => {
      console.error('Error fetching AI response:', error);
      this.aiOutput = 'An error occurred while fetching the AI response.';
      this.tableData = [];
      this.displayedColumns = [];
      this.isLoading = false;
    });
  }
}