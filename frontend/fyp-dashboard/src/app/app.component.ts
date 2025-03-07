import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidebarExpanded = true;

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded; // Toggle sidebar visibility
  }
}
