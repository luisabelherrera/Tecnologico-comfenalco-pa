
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const API_KEY = 'AIzaSyB9HNN9nYfHK07TlZiCjMG-qVXZ2u70Rxc';
export const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  constructor(private http: HttpClient) { }

  generateContent(prompt: string): Observable<any> {
    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };
    return this.http.post(API_URL, requestBody);
  }
}