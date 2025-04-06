import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import {
  ConversationService,
  Conversation,
} from './services/conversation.service';
import { ChatService } from './services/chat.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'FinAssistant';
  isSidebarVisible = true; // Sidebar visible by default on desktop, like ChatGPT
  conversations: Conversation[] = [];
  selectedConversationId: string | null = null;
  isLoading = false;
  private conversationListener: ((e: Event) => void) | null = null;

  // Dependency injection using inject()
  meta = inject(Meta);
  conversationService = inject(ConversationService);
  chatService = inject(ChatService);

  constructor() {
    this.setupMetaTags();
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
}