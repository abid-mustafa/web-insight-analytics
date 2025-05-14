import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsiteService {
  private baseUrl = 'http://localhost:5000/api/websites';

  // ← NEW: holds the currently selected website ID
  private selectedWebsiteSubject = new BehaviorSubject<number | null>(null);
  public selectedWebsite$ = this.selectedWebsiteSubject.asObservable();

  constructor(private http: HttpClient) { }

  /** Fetch all websites for the logged-in user */
  getWebsites(): Observable<any[]> {
    const userItem = localStorage.getItem('user');
    const user = userItem && JSON.parse(userItem);
    const userName = user && user.name;

    if (!userName) {
      console.error('Username missing or not authenticated');
      return of([]);
    }
    return this.http.get<any[]>(
      `${this.baseUrl}`,
      { withCredentials: true }
    );
  }

  addWebsite( domain: String, name: String ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}`,
      { domain, name },
      { withCredentials: true }
    );
  }

  getWebsiteDetails(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/details`);
  }

  updateWebsite(websiteId: string, domain: string, name: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update`, { websiteId, domain, name }, { withCredentials: true });
  }

  /** ← NEW: call this whenever the header selection changes */
  setSelectedWebsite(id: number) {
    this.selectedWebsiteSubject.next(id);
    localStorage.setItem('websiteUid', JSON.stringify(id));
  }
}
