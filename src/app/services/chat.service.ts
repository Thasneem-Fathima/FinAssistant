// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'https://finassistant.onrender.com/chat';

  public currentConversationId: string | null = null;

  constructor(private http: HttpClient) {}

  post(message: string): Observable<any> {
    const body = { message };
    return this.http.post<{ reply: string }>(this.apiUrl, body);
  }
}
