import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // grab the stored user + token
    const userJson = localStorage.getItem('user');
    let authReq = req;

    if (userJson) {
      const { token } = JSON.parse(userJson);
      if (token) {
        authReq = req.clone({
          // set the Authorization header
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
          // preserve cookies/session if you’re using withCredentials
          withCredentials: true,
        });
      }
    }

    return next.handle(authReq).pipe(
      catchError((err) => {
        // on 401 Unauthorized, send them back to login
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}

// export a provider you’ll add to AppModule
export const authInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
