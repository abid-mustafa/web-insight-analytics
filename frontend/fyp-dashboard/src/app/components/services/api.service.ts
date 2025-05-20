import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaginatedData {
  values: any[];
  total: number;
}

export interface ApiResponse {
  success: boolean;
  data: PaginatedData;
  cached?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  fetchTableData(
    websiteUid: string,
    endpoint: string,
    fromDate: string,
    toDate: string,
    offset: number,
    limit: number = 5,
    groupBy?: string
  ): Observable<ApiResponse> {
    const url = `${this.baseURL}/${endpoint}/?groupBy=${groupBy}&websiteUid=${websiteUid}&startDate=${fromDate}&endDate=${toDate}&offset=${offset}&limit=${limit}`;
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  fetchSummaryData(
    websiteUid: string,
    endpoint: string,
    toDate: string
  ): Observable<ApiResponse> {
    const url = `${this.baseURL}/${endpoint}/?websiteUid=${websiteUid}&endDate=${toDate}`;
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  fetchSingleValueDate(websiteUid: string,
    endpoint: string,
    fromDate: string,
    toDate: string,): Observable<ApiResponse> {
    const url = `${this.baseURL}/${endpoint}/?websiteUid=${websiteUid}&startDate=${fromDate}&endDate=${toDate}`;
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  fetchAIResponse(text: string): Observable<ApiResponse> {
    const url = `${this.baseURL}/search-bar`;
    return this.http.post<ApiResponse>(url, { text }, { withCredentials: true });
  }

  getRealtimeData(event: string, websiteUid: string): Observable<any> {
    const url = `${this.baseURL}/realtime/${event}/${websiteUid}`;
    return this.http.get<any>(url, { withCredentials: true });
  }
}
