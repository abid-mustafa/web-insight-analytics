import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // our login stores the whole user object under 'user'
    const userJson = localStorage.getItem('user');
    if (userJson) {
      // you could also parse and inspect roles/token here
      return true;
    }
    // not logged in → redirect to login
    return this.router.createUrlTree(['/login']);
  }
}