import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule } from "@angular/forms";
import { NgIf, NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";
import { UserService } from "../../auth/user.service";
import { AuthService } from "../../auth/auth.service";
import { customSwal } from '../../utils/custom-swal';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  profilepicture: string = '';
  rank: number = 0;
  uploadForm: FormGroup;
  profileImageUrl: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.uploadForm = this.fb.group({
      profile: [null],
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserProfile(userId).subscribe(
        (user) => {
          console.log('Full user object:', user);
          const backendUrl = 'http://localhost:3000';
          this.username = user.username;
          this.email = user.email;
          this.profilepicture = user.profilepicture ? `${backendUrl}${user.profilepicture}` : '';
          this.rank = user.rank;
          this.profileImageUrl = this.profilepicture;
        },
        (error) => {
          console.error('Error loading user profile:', error);
        }
      );
    } else {
      console.error('No user ID found');
    }
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
        this.uploadForm.patchValue({
          profile: file
        });
        this.uploadProfilePicture(file);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture(file: File): void {
    this.userService.uploadProfilePicture(file).subscribe(
      response => {
        console.log('Upload successful', response);
        if (response && response.filePath) {
          const backendUrl = 'http://localhost:3000';
          this.profileImageUrl = `${backendUrl}${response.filePath}`;
          this.profilepicture = this.profileImageUrl;
          customSwal({
            icon: 'success',
            title: 'Profile Picture Updated',
            text: 'Your profile picture has been updated successfully!',
            confirmButtonText: 'OK',
          });
        } else {
          customSwal({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Failed to get file path from server',
            confirmButtonText: 'Try Again',
          });
        }
      },
      error => {
        console.error('Error uploading profile picture', error);
        customSwal({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Image not allowed over 2MB: JPG, JPEG, PNG',
          confirmButtonText: 'Try Again',
        });
      }
    );
  }
}
