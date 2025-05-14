import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AiService {
    private baseUrl = 'http://localhost:5000/api/ai';
    constructor(private http: HttpClient) { }

    getIntelligentSearchBarResponse(websiteUid: String, text: String,): Observable<any> {
        return this.http.post(`${this.baseUrl}/search-bar`, { websiteUid, text }, {
            withCredentials: true,
        });
    }

    getAIGeneratedReport(websiteUid: String, startDate: String, endDate: String): Observable<any> {
        return this.http.post(`${this.baseUrl}/report`, { websiteUid, startDate, endDate }, {
            withCredentials: true,
        });
    }
}