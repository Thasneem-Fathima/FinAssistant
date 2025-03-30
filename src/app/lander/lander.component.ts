import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lander',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lander.component.html',
  styleUrls: ['./lander.component.scss'],
})
export class LanderComponent {
  message = 'Welcome to FinMate!';
  constructor(private router: Router) {}

  goTo(place: string) {
    this.router.navigate([place])
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}