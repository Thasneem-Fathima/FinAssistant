import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Conversation {
  id: string;
  title: string;
  messages: Array<{ user: boolean; text: string }>;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private apiUrl = environment.apiUrl + '/conversations';
  private http = inject(HttpClient);

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(this.apiUrl);
  }

  getConversation(id: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.apiUrl}/${id}`);
  }

  createConversation(title?: string): Observable<Conversation> {
    const initialConversation = {
      title: title || 'New conversation',
      messages: [],
    };
    return this.http.post<Conversation>(this.apiUrl, initialConversation);
  }

  deleteConversation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
