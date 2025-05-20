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
    private dialogShown = false;

    constructor(private router: Router, private dialog: MatDialog) { }

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
                    if (this.dialogShown) return;
                    this.dialogShown = true;

                    if (err.status === 401 || err.status === 409) {
                        // For /login or /register routes, do not show dialog; let component handle invalid credentials.
                        if (!this.isLoginOrRegisterRoute()) {
                            this.dialogShown = true;
                            this.showDialog('Session Expired', 'Your session has expired. Please log in again.');
                        }
                        return;
                    } else if (err.status === 403) {
                        this.showDialog('Access Denied', 'You do not have permission to access this resource.');
                        return;
                    } else if (err.status === 0 || err.status === 500) {
                        this.showDialog('Server Error', 'An error occurred on the server. Please try again later.');
                        return;
                    } else {
                        this.showDialog('Error', err.error?.message || 'An error occurred. Please try again.');
                        return;
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
        }).afterClosed().subscribe(() => {
            localStorage.clear();
            this.router.navigate(['/login']);
            this.dialogShown = false;
        });
    }
}