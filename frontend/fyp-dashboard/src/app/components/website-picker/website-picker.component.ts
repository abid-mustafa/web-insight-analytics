import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../../services/website.service';

@Component({
  selector: 'app-website-picker',
  templateUrl: './website-picker.component.html',
  styleUrl: './website-picker.component.scss'
})
export class WebsitePickerComponent implements OnInit {
  websites: any[] = [];
  selectedWebsite: string | null = null;

  constructor(private websiteService: WebsiteService) { }

  ngOnInit() {
    this.setWebsiteSelection();
    this.loadWebsites();
  }

  private setWebsiteSelection(): void {
    const uid = JSON.parse(localStorage.getItem('websiteUid') || 'null');
    if (uid) {
      this.selectedWebsite = uid;
      this.websiteService.setSelectedWebsite(uid);
    }
  }

  private loadWebsites(): void {
    this.websiteService.getWebsites().subscribe({
      next: (res: any) => {
        const arr = Array.isArray(res) ? res : res.data;
        this.websites = Array.isArray(arr) ? arr : [];

        const localWebsiteUid = JSON.parse(localStorage.getItem('websiteUid') || 'null');
        const matchedWebsite = this.websites.find(w => w.website_id === localWebsiteUid);

        if (matchedWebsite) {
          this.onWebsiteChange(matchedWebsite.website_id);
        } else if (this.websites.length) {
          this.onWebsiteChange(this.websites[0].website_id);
        }
      },
    });
  }

  onWebsiteChange(websiteId: string): void {
    this.selectedWebsite = websiteId;
    this.websiteService.setSelectedWebsite(websiteId);
    localStorage.setItem('websiteUid', JSON.stringify(websiteId));
  }

}
