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
import { NgClass, NgIf } from '@angular/common';
import { ChatService } from '../services/chat.service';
import { Meta } from '@angular/platform-browser';
import { ConversationService, Conversation } from '../services/conversation.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ChatBoxComponent } from './chat-box/chat-box.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf, ChatBoxComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements AfterViewChecked, OnInit, OnChanges {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('messageInput') private messageInput!: ElementRef;
  @Input() conversationId: string | null = null;

  inputText: string = '';
  messages: { user: boolean; text: string }[] = [];
  title = 'FinAssistant';
    isSidebarVisible = true; // Sidebar visible by default on desktop, like ChatGPT
    conversations: Conversation[] = [];
    selectedConversationId: string | null = null;
  isLoading: boolean = false;
  private shouldScroll = true;
  private conversationListener: ((e: Event) => void) | null = null;

  // Dependency injection using inject()
  chat = inject(ChatService);
  meta = inject(Meta);
  conversationService = inject(ConversationService);
  chatService = inject(ChatService);

  constructor() {
    this.setupMetaTags();
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
    this.loadConversations();

    // Set up event listener for new conversation creation
    this.conversationListener = ((event: CustomEvent) => {
      if (event.detail?.id) {
        this.selectedConversationId = event.detail.id;
        this.loadConversations();
      }
    }) as EventListener;

    window.addEventListener('conversation-created', this.conversationListener);
  
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

  ngOnDestroy(): void {
    // Clean up event listener to prevent memory leaks
    if (this.conversationListener) {
      window.removeEventListener('conversation-created', this.conversationListener);
    }
  }

  /** Sets up meta tags for SEO and page configuration */
  setupMetaTags(): void {
    this.meta.addTag({ name: 'description', content: 'FinAssistant' });
    this.meta.addTag({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    });
    this.meta.addTag({
      rel: 'icon',
      type: 'image/x-icon',
      href: 'favicon.ico',
    });
    this.meta.addTag({ property: 'og:title', content: 'FinAssistant' });
    this.meta.addTag({
      name: 'keywords',
      content: 'angular, nodejs, express, mongodb',
    });
    this.meta.addTag({ name: 'robots', content: 'index, follow' });
    this.meta.addTag({
      property: 'og:description',
      content:
        'A simple FinAssistant where you can chat with the bot and get the response.',
    });
  }

  /** Toggles sidebar visibility (used by collapse/expand buttons) */
  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  /** Loads all conversations from the service */
  loadConversations(): void {
    this.isLoading = true;
    this.conversationService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading conversations:', error);
        this.isLoading = false;
      },
    });
  }

  /** Creates a new chat conversation */
  newChat(): void {
    // Clear current conversation
    this.selectedConversationId = null;
    this.chatService.currentConversationId = null;

    // Dispatch event to clear messages in the chat component
    window.dispatchEvent(
      new CustomEvent('conversation-selected', {
        detail: { messages: [] },
      })
    );

    this.conversationService.createConversation().subscribe({
      next: (conversation) => {
        this.conversations.unshift(conversation);
        this.selectedConversationId = conversation.id;
        this.chatService.currentConversationId = conversation.id;

        // Close sidebar on mobile after creating a new chat
        if (window.innerWidth < 768) {
          this.toggleSidebar();
        }
      },
      error: (error) => {
        console.error('Error creating conversation:', error);
      },
    });
  }

  /** Selects an existing conversation by ID */
  selectConversation(id: string): void {
    this.selectedConversationId = id;
    this.chatService.currentConversationId = id;

    this.conversationService.getConversation(id).subscribe({
      next: (conversation) => {
        window.dispatchEvent(
          new CustomEvent('conversation-selected', { detail: conversation })
        );
        // Close sidebar on mobile after selecting a conversation
        if (window.innerWidth < 768) {
          this.toggleSidebar();
        }
      },
      error: (error) => {
        console.error('Error loading conversation:', error);
      },
    });
  }

  /** Deletes a conversation by ID */
  deleteConversation(id: string, event: Event): void {
    event.stopPropagation();
    this.conversationService.deleteConversation(id).subscribe({
      next: () => {
        this.conversations = this.conversations.filter((c) => c.id !== id);
        if (this.selectedConversationId === id) {
          this.newChat();
        }
      },
      error: (error) => {
        console.error('Error deleting conversation:', error);
      },
    });
  }

  openPortfolio(): void {
    console.log('Portfolio button clicked');
    // Add portfolio logic here
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
