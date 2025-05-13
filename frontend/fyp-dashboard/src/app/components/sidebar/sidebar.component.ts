import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() isExpanded = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  @HostBinding('class.collapsed')
  get collapsed(): boolean {
    return !this.isExpanded;
  }

  behaviorOpen = false;

  constructor(private router: Router) {}

  onBehaviorClick(): void {
    if (!this.isExpanded) {
      this.toggleSidebar.emit();
      // wait for parent to expand before showing children
      setTimeout(() => (this.behaviorOpen = true), 200);
      return;
    }
    this.behaviorOpen = !this.behaviorOpen;
  }

  isChildRouteActive(prefix: string): boolean {
    return this.router.url.startsWith(prefix);
  }
}
