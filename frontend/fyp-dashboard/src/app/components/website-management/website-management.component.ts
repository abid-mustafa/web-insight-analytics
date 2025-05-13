import { Component, OnInit } from '@angular/core';
import { WebsiteService } from '../services/website.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-website-management',
  templateUrl: './website-management.component.html',
  styleUrls: ['./website-management.component.scss']
})
export class WebsiteManagementComponent implements OnInit {
  websites: any[] = [];
  selectedWebsiteId: string = '';
  editForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  displayedColumns: string[] = ['name', 'domain', 'actions'];

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
    // this.loadWebsites();
   this.loadMockWebsites();
  }

  // Mocking the data
  loadMockWebsites() {
    this.websites = [
      { websiteId: '1', name: 'Example Website 1', domain: 'example1.com' },
      { websiteId: '2', name: 'Example Website 2', domain: 'example2.com' },
      { websiteId: '3', name: 'Example Website 3', domain: 'example3.com' },
      { websiteId: '4', name: 'Example Website 4', domain: 'example4.com' }
    ];
  }

  loadWebsites() {
    this.websiteService.getWebsites().subscribe({
      next: (data: any[]) => {
        this.websites = data;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to load websites';
      }
    });
  }

  onEdit(websiteId: string, name: string, domain: string) {
    this.selectedWebsiteId = websiteId;
    this.editForm.patchValue({
      name: name,
      domain: domain
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const { name, domain } = this.editForm.value;

    this.websiteService.updateWebsite(this.selectedWebsiteId, domain, name).subscribe({
      next: () => {
        this.successMessage = 'Website data updated successfully!';
        this.loadWebsites(); // Reload website list after successful update
        this.editForm.reset();
        this.selectedWebsiteId = ''; // Reset selected website ID
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update website data';
      }
    });
  }

  getTrackingScript(websiteId: string) {
    return `&lt;script async src="http://127.0.0.1:5000/static/tracker.js?websiteId=${websiteId}"&gt;&lt;/script&gt;`;
  }
}