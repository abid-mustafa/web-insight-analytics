import { Component } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isSidebarExpanded = true;
  showLayout = false;
  showPickers = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(
        // e is Event, we tell TS: “this predicate narrows it to NavigationEnd”
        filter((e: Event): e is NavigationEnd => e instanceof NavigationEnd)
      )
      .subscribe((e) => {
        const url = e.urlAfterRedirects;
        this.showLayout = url !== '/login' && url !== '/register';
        if (this.showLayout) {
          this.showPickers = !url.includes('ai') && url !== '/manage-websites' && url !== '/website-form';
        }
      });
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}