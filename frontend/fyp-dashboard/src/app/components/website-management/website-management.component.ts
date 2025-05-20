import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../services/website.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Website {
  website_id: string;
  name: string;
  domain: string;
}

@Component({
  selector: 'app-website-management',
  templateUrl: './website-management.component.html',
  styleUrls: ['./website-management.component.scss']
})
export class WebsiteManagementComponent implements OnInit {
  websites: Website[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  displayedColumns: string[] = ['name', 'domain', 'actions'];
  selectedWebsiteId: string | null = null;
  editForm: FormGroup;

  constructor(
    private websiteService: WebsiteService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      domain: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$')]]
    });
  }

  ngOnInit(): void {
    this.loadWebsites();
  }

  loadWebsites() {
    this.websiteService.getWebsites().subscribe({
      next: (data: any) => {
        const arr = Array.isArray(data) ? data : data.data;
        this.websites = Array.isArray(arr) ? arr : [];
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load websites';
      }
    });
  }

  onEdit(websiteId: string, name: string, domain: string) {
    this.selectedWebsiteId = websiteId;
    this.editForm.patchValue({ name, domain });
  }

  onSubmit() {
    if (this.editForm.valid && this.selectedWebsiteId) {
      const { name, domain } = this.editForm.value;
      this.websiteService.updateWebsite(this.selectedWebsiteId, domain, name).subscribe({
        next: () => {
          this.successMessage = 'Website data updated successfully!';
          this.selectedWebsiteId = null;
          this.editForm.reset();
          this.loadWebsites();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update website data';
        }
      });
    }
  }

  onCancel() {
    this.selectedWebsiteId = null;
    this.editForm.reset();
  }

  getTrackingScript(websiteId: string) {
    return `<script defer src="http://127.0.0.1:5000/tracker.js?website_id=${websiteId}"></script>`;
  }
}