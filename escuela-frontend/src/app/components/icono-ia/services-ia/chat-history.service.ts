import { Injectable } from '@angular/core';
import { ChatMessage } from '../models-ia/chat-message.interface';


@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService {
  private chatHistory: ChatMessage[] = [];
  private readonly maxChatHistoryLength: number = 10;

  getChatHistory(): ChatMessage[] {
    return this.chatHistory;
  }

  addToChatHistory(sender: 'user' | 'ai', message: string) {
    this.chatHistory.push({
      sender,
      message,
      timestamp: new Date(),
    });

    if (this.chatHistory.length > this.maxChatHistoryLength) {
      this.chatHistory.shift();
    }

    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 0);
  }

  clearChatHistory() {
    this.chatHistory = [];
  }
}