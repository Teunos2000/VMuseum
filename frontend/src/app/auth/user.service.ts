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

  uploadProfilePicture(file: File): Observable<{ filePath: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ filePath: string }>(`${this.apiUrl}/upload`, formData);
  }

  //Haalt user profiel op, wanneer je deze aanroept, geef je een ID mee
  getUserProfile(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/${userId}`, { headers });
  }
}
