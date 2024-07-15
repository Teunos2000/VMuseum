import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(private http: HttpClient) {}
  private apiUrl = 'http://localhost:3000/user';

  createUser (username: string, password: string, email: string, profilepicture: string, rank: number): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { username, password, email, profilepicture, rank });
  }

  checkUsernameAvailability(username: string): Observable<{available: boolean}> {
    return this.http.get<{available: boolean}>(`${this.apiUrl}/check-username/${username}`);
  }

  updateUser(userId: number, username?: string, password?: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const updateData: any = {};
    if (username) updateData.username = username;
    if (password) updateData.password = password;
    return this.http.patch(`${this.apiUrl}/${userId}`, updateData, { headers });
  }

  uploadProfilePicture(file: File, userId?: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('userId', userId.toString());
    }
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  //Haalt user profiel op, wanneer je deze aanroept, geef je een ID mee
  getUserProfile(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${userId}`, { headers });
  }
}
