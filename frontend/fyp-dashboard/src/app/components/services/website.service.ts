// src/app/services/website.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsiteService {
  private baseUrl = 'http://localhost:5000/api/websites';

  // ← NEW: holds the currently selected website ID
  private selectedWebsiteSubject = new BehaviorSubject<number | null>(null);
  public selectedWebsite$ = this.selectedWebsiteSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Fetch all websites for the logged-in user */
  getWebsites(): Observable<any[]> {
    const userItem = localStorage.getItem('user');
    const user = userItem && JSON.parse(userItem);
    const userId = user && user.id;
    if (!userId) {
      console.error('User ID missing or not authenticated');
      return of([]);
    }
    return this.http.get<any[]>(
      `${this.baseUrl}/by-userid/${userId}`,
      { withCredentials: true }
    );
  }

  /** ← NEW: call this whenever the header selection changes */
  setSelectedWebsite(id: number) {
    this.selectedWebsiteSubject.next(id);
    localStorage.setItem('websiteUid', JSON.stringify(id));
  }
}
