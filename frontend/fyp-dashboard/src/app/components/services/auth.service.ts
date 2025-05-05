import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuthPayload { email: string; password: string; name?: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://127.0.0.1:5000/api/auth';
  constructor(private http: HttpClient) {}

  login(payload: AuthPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }
  
  register(payload: AuthPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }
  
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }
}
