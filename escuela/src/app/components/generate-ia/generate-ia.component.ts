// src/app/generate-content/generate-content.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface GenerateContentResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

@Component({
  selector: 'app-generate-content',
  templateUrl: './generate-ia.component.html',
  styleUrls: ['./generate-ia.component.scss']
})
export class GenerateContentComponent {
  text: string = '';
  response: string | null = null;
  isLoading: boolean = false;

  @Output() contentGenerated = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  generateContent(): void {
    this.isLoading = true;
    const apiKey = 'AIzaSyANvZCYZ46X2JR_1NpHn8wIoUwl70BFKvY';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    this.http.post<GenerateContentResponse>(url, {
      contents: [
        {
          parts: [
            {
              text: this.text
            }
          ]
        }
      ]
    }).subscribe({
      next: (result) => {
        this.response = result.candidates[0]?.content?.parts[0]?.text || 'No response received';
        this.isLoading = false;
        this.contentGenerated.emit(this.response);  // Emit the generated content
      },
      error: (error) => {
        console.error('Error generating content:', error);
        this.response = 'An error occurred while generating content.';
        this.isLoading = false;
        this.contentGenerated.emit(this.response);  // Emit the error message
      }
    });
  }
}
