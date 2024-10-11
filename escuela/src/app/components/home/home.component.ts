import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output} from '@angular/core';


interface GenerateContentResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}
interface Message {
  content: string;
  timestamp: Date;
  sentByUser: boolean;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  text: string = '';
  response: string | null = null;
  isLoading: boolean = false;
  newMessage: string = '';
  messages: Message[] = [];

  @Output() contentGenerated = new EventEmitter<string>();

  constructor(private http: HttpClient) {}



  receiveMessage(content: string) {
    this.messages.push({
      content: content,
      timestamp: new Date(),
      sentByUser: false,
    });
  }


}