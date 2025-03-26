import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  responseData: any;  // Store API response
  apiUrl = 'http://localhost:5001/financial-assistant-jart/us-central1/api/chat';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.sendMessage();
  }

  sendMessage() {
    const requestBody = { message: "What are good investment options for beginners?" };

    this.http.post<{ reply: string }>(this.apiUrl, requestBody).subscribe({
      next: (response) => {
        this.responseData = response.reply;
        console.log('API Response:', this.responseData);
      },
      error: (error) => {
        console.error('API Error:', error);
        this.responseData = { error: 'Failed to fetch data' };
      }
    });
  }
}
