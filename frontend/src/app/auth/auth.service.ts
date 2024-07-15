import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private userRankSubject = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) {
    this.checkTokenAndSetRank();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (response.access_token) {
          localStorage.setItem('token', response.access_token);
          this.setUserRank();  // Set the user rank immediately after login
        }
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
    this.userRankSubject.next(null);  // Clear the rank when logged out
  }

  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.sub;
    }
    return null;
  }

  getUserRank(): Observable<number | null> {
    return this.userRankSubject.asObservable();
  }

  private setUserRank() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      this.userRankSubject.next(decodedToken.rank);
    }
  }

  private checkTokenAndSetRank() {
    if (this.isAuthenticated()) {
      this.setUserRank();
    }
  }

  isAdmin(): boolean {
    return this.userRankSubject.value === 2;
  }
}
