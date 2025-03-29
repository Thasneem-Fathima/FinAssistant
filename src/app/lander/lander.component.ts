import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lander',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss'],
})
export class LanderComponent {
  message = 'Welcome to FinMate!'; // Example property from AngularJS controller

  // Placeholder methods for interactivity (can be expanded)
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}