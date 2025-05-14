import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Injectable({
    'providedIn': 'root'
})
export class AuthInterceptorProvider implements HttpInterceptor {
    constructor(
        private router: Router,
        private dialog: MatDialog
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(tap({
            next: (event: HttpEvent<any>) => {
                if (event.type === HttpEventType.Response) {
                    // Handle successful responses if needed
                }
            },
            error: (err) => {
                if (err instanceof HttpErrorResponse) {
                    console.log('Error:', err);
                    
                    // Only redirect to login for authentication errors
                    if (err.status === 401 && !this.isLoginOrRegisterRoute()) {
                        // Handle session expiration
                        this.showDialog('Session Expired', 'Your session has expired. Please log in again.');
                        localStorage.clear();
                        this.router.navigate(['/login']);
                    } else if (err.status === 403) {
                        // Handle forbidden access
                        this.showDialog('Access Denied', 'You do not have permission to access this resource.');
                    } else {
                        // Handle other errors without redirecting
                        this.showDialog('Error', err.error.message || 'An error occurred. Please try again.');
                    }
                }
            },
        }));
    }

    private isLoginOrRegisterRoute(): boolean {
        const currentRoute = this.router.url;
        return currentRoute === '/login' || currentRoute === '/register';
    }

    private showDialog(title: string, message: string) {
        this.dialog.open(DialogComponent, {
            data: { title, message },
            width: '400px',
            disableClose: true
        });
    }
}