import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';

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

                    if (err.status === 401) {
                        if (!this.isLoginOrRegisterRoute()) {
                            this.showDialog('Session Expired', 'Your session has expired. Please log in again.', () => {
                                this.clearData();
                            });
                        }
                        return;
                    }
                    else if (err.status === 409) {
                        if (err.error?.code === 'LimitReached') {
                            return;
                        }
                        this.showDialog('Email already registered', err.error?.message || 'A user already exists with this email, try logging in', () => {
                            this.clearData();
                        });
                        return;
                    }
                    else if (err.status === 0 || err.status === 500) {
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

    private clearData(): void {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    private showDialog(title: string, message: string, onClose?: () => void) {
        this.dialog.open(DialogComponent, {
            data: { title, message },
            width: '400px',
            disableClose: true
        }).afterClosed().subscribe(() => {
            if (onClose) onClose();
            this.dialogShown = false;
        });
    }
}