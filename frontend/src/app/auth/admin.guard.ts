import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'  // Marks this service as available application-wide
})
export class AdminGuard implements CanActivate {
  // Constructor to inject AuthService and Router
  constructor(private authService: AuthService, private router: Router) {}

  // Method to determine if the route can be activated
  canActivate(): boolean {
    // Check if the user has admin privileges
    if (this.authService.isAdmin()) {
      return true;  // If user is an admin, allow access
    } else {
      this.router.navigate(['/']);  // If not an admin, redirect to home page
      return false;  // Deny access
    }
  }
}
