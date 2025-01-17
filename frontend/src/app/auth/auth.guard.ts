import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'  // Marks this service as available application-wide
})
export class AuthGuard implements CanActivate {
  // Constructor to inject AuthService and Router
  constructor(private authService: AuthService, private router: Router) {}

  // Method to determine if the route can be activated
  canActivate(): boolean {
    // Check if the user is authenticated
    if (this.authService.isAuthenticated()) {
      return true;  // If authenticated, allow access
    } else {
      this.router.navigate(['/login']);  // If not authenticated, redirect to login
      return false;  // Deny access
    }
  }
}
