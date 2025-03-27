import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent {
  // Array of modes for financial contexts
  modes = [
    { label: 'Investment', value: 'investment' },
    { label: 'Market Analysis', value: 'market-analysis' },
    { label: 'Budgeting', value: 'budgeting' },
    { label: 'Financial Education', value: 'fin-edu' },
  ];

  // Component state
  selectedMode: string = this.modes[0].value; // Default to first mode
  message: string = ''; // Text input binding

  // Output events for parent component interaction
  @Output() modeChanged = new EventEmitter<string>();
  @Output() messageSent = new EventEmitter<string>();
  @Output() fileSelected = new EventEmitter<File>();
  @Output() imageSelected = new EventEmitter<File>();
  @Output() recordAudioClicked = new EventEmitter<void>();

  // Select a mode and emit the change
  selectMode(mode: string): void {
    this.selectedMode = mode;
    this.modeChanged.emit(mode);
  }

  // Send the message if not empty and clear the input
  sendMessage(): void {
    if (this.message.trim()) {
      this.messageSent.emit(this.message);
      this.message = '';
    }
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileSelected.emit(input.files[0]);
    }
  }

  // Handle image selection
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageSelected.emit(input.files[0]);
    }
  }

  // Emit event when audio recording is requested
  onRecordAudioClicked(): void {
    this.recordAudioClicked.emit();
  }
}