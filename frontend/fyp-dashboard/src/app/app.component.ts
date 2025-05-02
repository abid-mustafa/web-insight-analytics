import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Web Insight';
  isSidebarExpanded = true;

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded; // Toggle sidebar visibility
  }
}
