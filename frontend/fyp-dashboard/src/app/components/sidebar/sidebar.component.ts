import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  constructor(private router: Router) {}

  @Input() isExpanded = true;
  behaviorOpen = false;
  toggleBehavior() {
    this.behaviorOpen = !this.behaviorOpen;
  }
  isChildRouteActive(prefix: string) {
    return this.router.url.startsWith(prefix);
  }
}
