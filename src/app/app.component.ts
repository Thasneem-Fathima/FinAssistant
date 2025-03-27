import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ChatComponent } from './chat/chat.component';
import { Meta } from '@angular/platform-browser';
import { NgClass } from '@angular/common';
import {
  ConversationService,
  Conversation,
} from './services/conversation.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'chatgpt-clone-app';
  isSidebarOpen = false;
  conversations: Conversation[] = [];
  selectedConversationId: string | null = null;
  isLoading = false;
  private conversationListener: ((e: Event) => void) | null = null;

  meta = inject(Meta);
  conversationService = inject(ConversationService);
  chatService = inject(ChatService);

  constructor() {
    this.setupMetaTags();
  }

  ngOnInit(): void {
    this.loadConversations();

    // Store listener reference for cleanup
    this.conversationListener = ((event: CustomEvent) => {
      if (event.detail?.id) {
        this.selectedConversationId = event.detail.id;
        this.loadConversations();
      }
    }) as EventListener;

    window.addEventListener('conversation-created', this.conversationListener);
  }

  ngOnDestroy(): void {
    // Clean up event listener
    if (this.conversationListener) {
      window.removeEventListener(
        'conversation-created',
        this.conversationListener
      );
    }
  }

  setupMetaTags(): void {
    this.meta.addTag({ name: 'description', content: 'ChatGPT Clone App' });
    this.meta.addTag({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    });
    this.meta.addTag({
      rel: 'icon',
      type: 'image/x-icon',
      href: 'favicon.ico',
    });
    this.meta.addTag({
      rel: 'canonical',
      href: 'https://chatgpt-clone-app-manthanank.vercel.app/',
    });
    this.meta.addTag({ property: 'og:title', content: 'Chatgpt Clone App' });
    this.meta.addTag({ name: 'author', content: 'Manthan Ankolekar' });
    this.meta.addTag({
      name: 'keywords',
      content: 'angular, nodejs. express, mongodb',
    });
    this.meta.addTag({ name: 'robots', content: 'index, follow' });
    this.meta.addTag({
      property: 'og:description',
      content:
        'A simple chatgpt clone app where you can chat with the bot and get the response.',
    });
    this.meta.addTag({
      property: 'og:image',
      content: 'https://chatgpt-clone-app-manthanank.vercel.app/image.jpg',
    });
    this.meta.addTag({
      property: 'og:url',
      content: 'https://chatgpt-clone-app-manthanank.vercel.app/',
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
  }

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

  newChat(): void {
    // Clear selected conversation first
    this.selectedConversationId = null;
    this.chatService.currentConversationId = null;

    // Clear existing messages
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

        if (window.innerWidth < 768) {
          this.toggleSidebar();
        }
      },
      error: (error) => {
        console.error('Error creating conversation:', error);
      },
    });
  }

  selectConversation(id: string): void {
    this.selectedConversationId = id;
    this.chatService.currentConversationId = id;

    this.conversationService.getConversation(id).subscribe({
      next: (conversation) => {
        window.dispatchEvent(
          new CustomEvent('conversation-selected', { detail: conversation })
        );
        if (window.innerWidth < 768) {
          this.toggleSidebar();
        }
      },
      error: (error) => {
        console.error('Error loading conversation:', error);
      },
    });
  }

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
}
