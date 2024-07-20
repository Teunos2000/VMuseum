import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Room } from './room.model';
import { RoomService } from "./room.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'rooms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css'
})
export class RoomsComponent implements OnInit {
  rooms: Room[] = [];
  backendUrl = 'http://localhost:3000';

  constructor(private roomService: RoomService) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data.map(room => ({
          ...room,
          picture: room.picture ? `${this.backendUrl}${room.picture}` : ''
        }));
        console.log(this.rooms);
      },
      error: (err) => console.error('Failed to load rooms', err)
    });
  }
}
