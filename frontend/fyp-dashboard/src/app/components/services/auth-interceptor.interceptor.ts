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

                    if (err.status === 401 && !this.isLoginOrRegisterRoute()) {
                        this.showDialog('Session Expired', 'Your session has expired. Please log in again.');
                        localStorage.clear();
                        this.router.navigate(['/login']);
                    } else if (err.status === 403) {
                        this.showDialog('Access Denied', 'You do not have permission to access this resource.');
                    } else if (err.status === 0 || err.status === 500) {
                        this.showDialog('Server Error', 'An error occurred on the server. Please try again later.');
                    } else {
                        this.showDialog('Error', err.error?.message || 'An error occurred. Please try again.');
                    }
                }
            },
            complete: () => {

            }
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