import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private router: Router) {}

  onSubmit(): void {
    // Placeholder login logic
    console.log('Login submitted:', { email: this.email, password: this.password, rememberMe: this.rememberMe });
    // Add actual authentication logic here (e.g., call a service)
    // On success, navigate to a dashboard or home page
    this.router.navigate(['/dashboard']); // Example navigation
  }

  loginWithGoogle(): void {
    // Placeholder Google login logic
    console.log('Login with Google clicked');
    // Add Google OAuth logic here
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

  forgotPassword(): void {
    console.log('Forgot Password clicked');
    // Add forgot password logic (e.g., open a modal or navigate)
  }
}