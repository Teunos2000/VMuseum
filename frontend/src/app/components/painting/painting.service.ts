import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { Painting } from './painting.model';

@Injectable({
  providedIn: 'root'
})
export class PaintingService {
  private apiUrl = 'http://localhost:3000/painting';

  constructor(private http: HttpClient) {}

  getPaintingsByRoom(roomId: number): Observable<Painting[]> {
    if (isNaN(roomId)) {
      return throwError('Invalid room ID');
    }
    return this.http.get<Painting[]>(`${this.apiUrl}/room/${roomId}`);
  }
}
