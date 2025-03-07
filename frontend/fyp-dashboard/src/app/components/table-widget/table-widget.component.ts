import { Component, Input, OnInit, ViewChild, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { ApiService } from '../services/api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-widget',
  standalone: false,
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss']
})
export class TableWidgetComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() endpoint!: string;
  @Input() fromDate: string = '2024-10-01';
  @Input() toDate: string = '2024-10-07';

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  pageIndex = 0;
  pageSize = 5;
  length = 0;
  displayedColumns!: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.fetchData();
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Trigger data fetch when date range changes
    if (changes['fromDate'] || changes['toDate']) {
      this.fetchData();
    }
  }

  fetchData(): void {
    this.apiService.fetchTableData(this.endpoint, this.fromDate, this.toDate, this.pageIndex * this.pageSize)
      .subscribe((result: any) => {
        if (result.data && result.data.length > 0) {
          this.displayedColumns = Object.keys(result.data[0]);
        }
        this.dataSource.data = result.data;
        // Only update total on first page load if you want to preserve the overall count
        if (this.pageIndex === 0) {
          this.length = result.total;
        }
        console.log(`Length: ${this.length} for ${this.endpoint}`);
      }, error => {
        console.error('Error fetching data:', error);
      });
  }  

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.fetchData();
  }
}
