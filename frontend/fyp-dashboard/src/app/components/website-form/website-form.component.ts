import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WebsiteService } from '../../services/website.service';

@Component({
  selector: 'app-form',
  templateUrl: './website-form.component.html',
  styleUrl: './website-form.component.scss',
})
export class WebsiteFormComponent implements OnInit {
  websiteForm!: FormGroup;
  websiteId: string = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private websiteService: WebsiteService) {

  }

  ngOnInit() {
    this.websiteForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      domain: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$'
          ),
        ],
      ],
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.websiteForm.invalid) {
      this.websiteForm.markAllAsTouched();
      return;
    }

    const { name, domain } = this.websiteForm.value;
    this.websiteService.addWebsite(domain, name).subscribe({
      next: (data: any) => {
        this.websiteId = data.websiteId;
        this.websiteForm.reset();
        this.websiteForm.markAsPristine();
        this.websiteForm.markAsUntouched();
        Object.keys(this.websiteForm.controls).forEach((key) => {
          this.websiteForm.get(key)?.setErrors(null);
        });
      },
      error: (err) => (this.errorMessage = err.error?.message),
    });
  }

  getTrackingScript(websiteId: string) {
    return `<script defer src="http://127.0.0.1:5000/static/tracker.js?website_uid=${websiteId}"></script>`;
  }
}
