export interface ChatMessage {
    sender: 'user' | 'ai';
    message: string;
    timestamp: Date;
  }