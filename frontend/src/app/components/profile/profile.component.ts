// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import {NgIf, NgOptimizedImage} from "@angular/common";
import { RouterLink } from "@angular/router";
import { UserService } from "../../auth/user.service";
import { AuthService } from "../../auth/auth.service";

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
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  profilepicture: string = '';
  rank: number = 0;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserProfile(userId).subscribe(
        (user) => {
          console.log('Full user object:', user);
          this.username = user.username;
          this.email = user.email;
          this.profilepicture = user.profilepicture;
          this.rank = user.rank;
        },
        (error) => {
          console.error('Error loading user profile:', error);
        }
      );
    } else {
      console.error('No user ID found');
    }
  }
}
