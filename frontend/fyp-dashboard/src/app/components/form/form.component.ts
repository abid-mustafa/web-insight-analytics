import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  websiteForm: FormGroup;
  submittedData: { domain: string; websiteName: string } | null = null;

  constructor(private fb: FormBuilder) {
    this.websiteForm = this.fb.group({
      domain: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\\.[a-zA-Z]{2,}$')]],
      websiteName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit() {
    if (this.websiteForm.valid) {
      this.submittedData = this.websiteForm.value;
      this.websiteForm.reset();
    }
  }
}
