import { Component } from '@angular/core';

@Component({
  selector: 'app-ai-page',
  templateUrl: './ai.component.html',
  styleUrls: ['./ai.component.scss'],
})
export class AiComponent {
  userInput: string = '';
  submitted: boolean = false;

  onSubmit(): void {
    // Only show the response section once user clicks Submit
    this.submitted = true;
  }
}