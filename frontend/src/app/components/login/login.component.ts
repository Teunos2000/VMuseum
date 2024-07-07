import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {NgIf} from "@angular/common";
import {customSwal} from "../../utils/custom-swal";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);  // Log the response
        localStorage.setItem('token', response.access_token);

        customSwal({
          icon: 'success',
          title: 'Welcome back!',
          text: 'Glad to see exploring the museum again!',
          confirmButtonText: 'Let\'s Go!',
        })
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.error = 'Login failed. Please check your credentials.';
      }
    });
  }
}
