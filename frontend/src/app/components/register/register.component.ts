import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../auth/user.service';
import Swal from 'sweetalert2';
import { customSwal } from '../../utils/custom-swal';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  repeatPassword: string = '';
  error: string = '';
  submitted: boolean = false;
  isLoading: boolean = false;
  uploadForm: FormGroup;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.uploadForm = this.fb.group({
      profile: [null],
    });
  }

  isEmptyAndSubmitted(field: string): boolean {
    return this.submitted && field.trim() === '';
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.patchValue({
        profile: file,
      });
    }
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
      this.error = 'Password must be at least 4 characters long and contain at least one uppercase letter and one number.';
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
          this.uploadProfilePicture();
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

  private uploadProfilePicture() {
    const profileControl = this.uploadForm.get('profile');
    if (profileControl && profileControl.value) {
      const file = profileControl.value;
      this.userService.uploadProfilePicture(file).subscribe(
        response => {
          console.log('Upload successful', response);
          if (response && response.filePath) {
            this.createUser(response.filePath);
          } else {
            this.error = 'Failed to get file path from server';
            this.isLoading = false;
          }
        },
        error => {
          console.error('Error uploading profile picture', error);
          this.error = 'Something went wrong uploading your profile picture';
          this.isLoading = false;
        }
      );
    } else {
      this.error = 'Profile picture is required.';
      this.isLoading = false;
    }
  }

  private createUser(profilePicturePath: string) {
    this.userService.createUser(this.username, this.password, this.email, profilePicturePath, 1)
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

        // Show success alert
        customSwal({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Welcome to Teuns Virtual Museum!',
          confirmButtonText: 'Let\'s Go!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/']);
          }
        });
      },
      error: (error) => {
        console.error('Auto-login failed', error);
        this.error = 'Account created, but auto-login failed. Please log in manually.';
        this.isLoading = false;
      }
    });
  }
}
