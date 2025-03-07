import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://192.168.154.45:5000/api/';

  constructor(private http: HttpClient) { }

  /**
   * Fetch data from the API based on the selected date range and pagination.
   * @param endpoint API endpoint (e.g., 'events/active-users-by-event-name')
   * @param fromDate Start date (YYYY-MM-DD)
   * @param toDate End date (YYYY-MM-DD)
   * @param offset Offset for pagination (0, 5, 10, etc.)
   * @returns Observable containing the API response
   */
  fetchTableData(endpoint: string, fromDate: string, toDate: string, offset: number, limit: number = 5): Observable<any[]> {
    const url = `${this.baseURL}${endpoint}/?start_date=${fromDate}&end_date=${toDate}&offset=${offset}&limit=${limit}`;
    return this.http.get<any[]>(url);
  }

  fetchAIResponse(text: string): Observable<any[]> {
    const url = `${this.baseURL}search-bar`;
    return this.http.post<any[]>(url, { text });
  }

  getRealtimeData(): Observable<any[]> {
    const url = `${this.baseURL}get-realtime`;
    return this.http.get<any[]>(url);
  }
}
