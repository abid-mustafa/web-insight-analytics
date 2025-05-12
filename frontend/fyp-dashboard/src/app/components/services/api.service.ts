import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { groupBy, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseURL = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  fetchTableData(
    websiteUid: number,
    endpoint: string,
    fromDate: string,
    toDate: string,
    offset: number,
    limit: number = 5,
    groupBy?: string
  ): Observable<any[]> {
    const url = `${this.baseURL}/${endpoint}/?groupBy=${groupBy}&websiteUid=${websiteUid}&startDate=${fromDate}&endDate=${toDate}&offset=${offset}&limit=${limit}`;
    return this.http.get<any[]>(url, { withCredentials: true });
  }

  fetchSummaryData(
    websiteUid: number,
    endpoint: string,
    toDate: string
  ): Observable<any[]> {
    const url = `${this.baseURL}/${endpoint}/?websiteUid=${websiteUid}&endDate=${toDate}`;
    return this.http.get<any[]>(url, { withCredentials: true });
  }

  fetchAIResponse(text: string): Observable<any[]> {
    const url = `${this.baseURL}/search-bar`;
    return this.http.post<any[]>(url, { text });
  }

  getRealtimeData(): Observable<any[]> {
    const url = `${this.baseURL}/get-realtime`;
    return this.http.get<any[]>(url);
  }
}
