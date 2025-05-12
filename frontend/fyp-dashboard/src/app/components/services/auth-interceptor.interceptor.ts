import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";
@Injectable({
    'providedIn': 'root'
})

export class AuthInterceptorProvider implements HttpInterceptor {
    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(tap({
            next: (event: HttpEvent<any>) => {
                if (event.type === HttpEventType.Response) {
                    // console.log('Response data==>', event.status);
                }
            },
            error: (err) => {
                if (err instanceof HttpErrorResponse) {
                    console.log('ERR', err);
                    // alert(`Session expired. Please login again. ${err.error.message}`,);
                    // localStorage.clear();
                    // this.router.navigate(['login']);
                }
            },
        }
        ));
    }
}