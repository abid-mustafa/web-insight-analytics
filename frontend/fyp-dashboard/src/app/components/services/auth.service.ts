import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  constructor(private http: HttpClient) { }

  login(payload: AuthPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload, {
      withCredentials: true,
    });
  }

  register(payload: AuthPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }
}