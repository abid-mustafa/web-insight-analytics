import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-analytics',
  standalone: false,
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements AfterViewInit {
  inputText: string = '';
  responseData: any;
  tableData: any[] = [];
  displayedColumns: string[] = [];

  @ViewChild(MatTable) table!: MatTable<any>;  // Reference to the Material Table

  constructor(private apiService: ApiService) {}

  ngAfterViewInit() {
    if (this.table) {
      this.table.renderRows(); // Ensure table updates after initialization
    }
  }

  onSend(): void {
    this.apiService.fetchAIResponse(this.inputText).subscribe((response: any) => {
      console.log('Received AI response:', response);
      this.responseData = response;

      if (response.promptType === 'query' && Array.isArray(response.answer) && response.answer.length > 0) {
        const limitedData = response.answer.slice(0, 5); // Limit to 5 rows
        this.displayedColumns = Object.keys(limitedData[0]); // Extract column names
        this.tableData = limitedData; // Assign data to table

        console.log("Columns:", this.displayedColumns);
        console.log("Table Data:", this.tableData);

        // Force table refresh
        setTimeout(() => {
          if (this.table) {
            this.table.renderRows();
          }
        });
      }
    });
  }
}
