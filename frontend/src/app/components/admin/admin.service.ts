import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Creates a new room with the given room data.
   * @param  roomData room data as FormData, typically includes details like room name, capacity, etc.
   * @returns Observable that resolves to the API response.
   */
  createRoom(roomData: { subject: string; name: string; description: string; style: string; capacity: number }): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/room`, roomData, { headers });
  }


  /**
   * Uploads a picture for a specific room.
   * @param roomId The ID of the room.
   * @param file The picture file to upload.
   * @returns Observable that resolves to the API response.
   */
  uploadRoomPicture(roomId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/room/${roomId}/upload-picture`, formData, { headers });
  }

  /**
   * Uploads music for a specific room.
   * @param roomId The ID of the room.
   * @param file The music file to upload.
   * @returns Observable that resolves to the API response.
   */
  uploadRoomMusic(roomId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/room/${roomId}/upload-music`, formData, { headers });
  }

  /**
   * Uploads a voiceover for a specific room.
   * @param roomId The ID of the room.
   * @param file The voiceover file to upload.
   * @returns Observable that resolves to the API response.
   */
  uploadRoomVoiceover(roomId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/room/${roomId}/upload-voiceover`, formData, { headers });
  }

  createPainting(paintingData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/painting`, paintingData, { headers });
  }

  uploadPaintingPicture(paintingId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.apiUrl}/painting/${paintingId}/upload-picture`, formData, { headers });
  }

  /**
   * Fetches all rooms for the painting -> display room relation
   */
  getAllRooms(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(`${this.apiUrl}/room`, { headers });
  }

  /**
   * Retrieves the authentication token from local storage.
   * @returns The bearer token as a string.
   */
  private getToken(): string {
    // Safely retrieve the token or return an empty string if not found
    return localStorage.getItem('token') || '';
  }


}
