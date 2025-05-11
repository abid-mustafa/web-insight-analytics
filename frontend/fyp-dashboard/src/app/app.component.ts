import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Web Insight';
  isSidebarExpanded = true;
  showLayout = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        // e is Event, we tell TS: “this predicate narrows it to NavigationEnd”
        filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe((e) => {
        // now TS knows `e` has `urlAfterRedirects`
        const hideOn = ['/login', '/register'];
        this.showLayout = !hideOn.includes(e.urlAfterRedirects);
      });
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}