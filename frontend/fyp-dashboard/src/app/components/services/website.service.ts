import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebsiteService {
  private baseUrl = 'http://localhost:5000/api/websites';

  constructor(private http: HttpClient) {}

  getWebsites(): Observable<any[]> {
    const userItem = localStorage.getItem('user');
    // userItem && JSON.parse(userItem) only runs JSON.parse if userItem is truthy
    const user   = userItem && JSON.parse(userItem);
    const userId = user   && user.id;

    if (!userId) {
      console.error('User ID missing or not authenticated');
      return of([]);
    }

    return this.http.get<any[]>(
      `${this.baseUrl}/by-userid/${userId}`,
      { withCredentials: true }
    );
  }
}