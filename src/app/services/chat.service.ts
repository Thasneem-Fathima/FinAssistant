import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl + '/chat';
  private conversationsUrl = environment.apiUrl + '/conversations';
  http = inject(HttpClient);
  
  currentConversationId: string | null = null;

  post(prompt: string): Observable<any> {
    return this.http
      .post<{bot: string; conversationId?: string}>(this.apiUrl, { 
        prompt,
        conversationId: this.currentConversationId
      })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.status ? 
        `Error ${error.status}: ${error.error.message || 'Unknown error'}` :
        'Server error';
    }
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}