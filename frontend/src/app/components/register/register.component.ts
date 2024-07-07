import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthService} from "../../auth/auth.service";
import {Router, RouterLink} from "@angular/router";
import {UserService} from "../../auth/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  profilepicture: string = '';
  rank: number = 1;
  repeatPassword: string = '';
  error: string = '';
  submitted: boolean = false;
  isLoading: boolean = false;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {}

  isEmptyAndSubmitted(field: string): boolean {
    return this.submitted && field.trim() === '';
  }

  onSubmit() {
    this.isLoading = true;
    this.submitted = true;
    this.error = '';

    // Check if any field is empty
    if (!this.username || !this.email || !this.password || !this.repeatPassword) {
      this.error = 'All fields are required.';
      this.isLoading = false;
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.error = 'Please enter a valid email address.';
      this.isLoading = false;
      return;
    }

    // Check if password meets requirements
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{4,}$/;
    if (!passwordRegex.test(this.password)) {
      this.error = 'Password must be at least 4 characters long.';
      this.isLoading = false;
      return;
    }

    // Check if passwords match
    if (this.password !== this.repeatPassword) {
      this.error = 'Passwords do not match.';
      this.isLoading = false;
      return;
    }

    // Check username availability before creating user
    this.userService.checkUsernameAvailability(this.username).subscribe(
      response => {
        if (response.available) {
          this.createUser();
        } else {
          this.error = 'Username taken';
          this.isLoading = false;
        }
      },
      error => {
        console.error('Error checking username availability', error);
        this.error = 'An error occurred. Please try again.';
        this.isLoading = false;
      }
    );
  }

  private createUser() {
    this.userService.createUser(this.username, this.password, this.email, this.profilepicture, this.rank)
      .subscribe(
        response => {
          console.log('User created successfully', response);
          this.loginUser();
        },
        error => {
          console.error('Error creating user', error);
          this.error = "Something went wrong creating your account";
          this.isLoading = false;
        }
      );
  }

  private loginUser() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        localStorage.setItem('token', response.access_token);
        this.isLoading = false;
        this.router.navigate(['/']); // Redirect to home page or dashboard
      },
      error: (error) => {
        console.error('Auto-login failed', error);
        this.error = 'Account created, but auto-login failed. Please log in manually.';
        this.isLoading = false;
      }
    });
  }
}
