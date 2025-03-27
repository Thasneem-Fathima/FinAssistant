import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ChatService } from '../services/chat.service';
import { ConversationService } from '../services/conversation.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ChatBoxComponent } from './chat-box/chat-box.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass, ChatBoxComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewChecked, OnInit, OnChanges {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  @Input() conversationId: string | null = null;

  inputText: string = '';
  messages: { user: boolean; text: string }[] = [];
  isLoading: boolean = false;
  private shouldScroll = true;

  chat = inject(ChatService);
  conversationService = inject(ConversationService);

  constructor() {
    // Listen for conversation selection events
    window.addEventListener('conversation-selected', ((event: CustomEvent) => {
      if (event.detail && event.detail.messages) {
        this.messages = event.detail.messages;
        this.shouldScroll = true;
        setTimeout(() => this.scrollToBottom(), 100);
      }
    }) as EventListener);
  }

  ngOnInit(): void {
    if (this.conversationId) {
      this.loadConversation(this.conversationId);
    } else {
      // Reset messages for new conversation
      this.messages = [];
    }

    // Listen for conversation selection events
    window.addEventListener('conversation-selected', ((event: CustomEvent) => {
      this.messages = event.detail?.messages || [];
      this.shouldScroll = true;
      setTimeout(() => this.scrollToBottom(), 100);
    }) as EventListener);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversationId']) {
      if (this.conversationId) {
        this.loadConversation(this.conversationId);
      } else {
        // Clear messages when conversationId becomes null
        this.messages = [];
        this.shouldScroll = true;
      }
    }
  }

  loadConversation(id: string): void {
    this.isLoading = true;
    this.conversationService.getConversation(id).subscribe({
      next: (conversation) => {
        this.messages = conversation.messages || [];
        this.isLoading = false;
        this.shouldScroll = true;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (error) => {
        console.error('Error loading conversation:', error);
        this.isLoading = false;
      },
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  onInputChange() {
    setTimeout(() => this.adjustTextareaHeight());
  }

  adjustTextareaHeight() {
    if (this.messageInput?.nativeElement) {
      const textarea = this.messageInput.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }

  handleEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (keyboardEvent.key === 'Enter' && keyboardEvent.shiftKey) {
      setTimeout(() => this.adjustTextareaHeight());
    }
  }

  sendMessage() {
    if (this.inputText.trim() && !this.isLoading) {
      const userMessage = this.inputText.trim();
      this.messages.push({ user: true, text: userMessage });
      this.inputText = '';
      this.isLoading = true;
      this.shouldScroll = true;

      // Reset textarea height
      if (this.messageInput?.nativeElement) {
        this.messageInput.nativeElement.style.height = 'auto';
      }

      this.chat
        .post(userMessage)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.shouldScroll = true;
          })
        )
        .subscribe({
          next: (response) => {
            if (response.bot) {
              this.messages.push({ user: false, text: response.bot.trim() });
            }

            if (response.conversationId && !this.conversationId) {
              this.conversationId = response.conversationId;
              this.chat.currentConversationId = response.conversationId;

              window.dispatchEvent(
                new CustomEvent('conversation-created', {
                  detail: { id: response.conversationId },
                })
              );
            }

            setTimeout(() => this.scrollToBottom(), 100);
          },
          error: (error) => {
            console.error('Error:', error);
            this.messages.push({
              user: false,
              text:
                error.message ||
                'Sorry, I encountered an error. Please try again.',
            });
            setTimeout(() => this.scrollToBottom(), 100);
          },
        });
    }
  }

  onModeChanged(mode: string) {
    console.log('Mode changed to:', mode);
  }

  onMessageSent(message: string) {
    console.log('Message sent:', message);
  }

  onFileSelected(file: File) {
    console.log('File selected:', file);
  }

  onImageSelected(image: File) {
    console.log('Image selected:', image);
  }

  onRecordAudioClicked() {
    console.log('Audio recording clicked');
    // Implement audio recording logic here
  }

  useExample(text: string) {
    this.inputText = text;
    this.sendMessage();
  }
}
