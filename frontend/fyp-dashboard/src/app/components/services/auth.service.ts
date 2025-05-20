import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';
  constructor(private http: HttpClient) { }

  login(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, payload, {
      withCredentials: true,
    });
  }

  register(payload: AuthPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/register`, payload, {
      withCredentials: true,
    });
  }

  logout(): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean, message?: string }>(
      `${this.baseUrl}/logout`,
      {},
      { withCredentials: true }
    );
  }
}