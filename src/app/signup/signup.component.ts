import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    // Placeholder signup logic
    console.log('Sign Up submitted:', { email: this.email, password: this.password });
    // Add actual signup logic here (e.g., call a service)
    this.router.navigate(['/chat']); // Example navigation
  }

  signupWithGoogle(): void {
    // Placeholder Google signup logic
    console.log('Sign Up with Google clicked');
    // Add Google OAuth logic here
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
