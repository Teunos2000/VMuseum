import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthService} from "../../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  repeatPassword: string = '';
  error: string = '';
  submitted: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  isEmptyAndSubmitted(field: string): boolean {
    return this.submitted && field.trim() === '';
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    // Check if any field is empty
    if (!this.username || !this.email || !this.password || !this.repeatPassword) {
      this.error = 'All fields are required.';
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      return;
    }

    // Check if password meets requirements
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{4,}$/;
    if (!passwordRegex.test(this.password)) {
      this.error = 'Password must be at least 4 characters long.';
      return;
    }

    // Check if passwords match
    if (this.password !== this.repeatPassword) {
      this.error = 'Passwords do not match.';
      return;
    }

    // If all validations pass, proceed with registration
    console.log('Registration data:', {
      username: this.username,
      email: this.email,
      password: this.password
    });

    // Here you would typically call a service to handle the registration
    // For example: this.authService.register(this.username, this.email, this.password)
  }
}
