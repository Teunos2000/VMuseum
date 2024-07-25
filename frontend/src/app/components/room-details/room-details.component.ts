import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from "@angular/router";
import { Location, NgIf } from '@angular/common';
import { Room } from "../rooms/room.model";
import { RoomService } from "../rooms/room.service";
import { switchMap } from 'rxjs/operators';
import {PaintingsComponent} from "../painting/painting.component";
import {RoomsComponent} from "../rooms/rooms.component";

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    PaintingsComponent,
    RoomsComponent
  ],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
export class RoomDetailsComponent implements OnInit {
  currentPath: string = '';
  room: Room = {} as Room;
  backendUrl = 'http://localhost:3000';

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.currentPath = this.router.url;
    this.loadRoomDetails();
  }

  loadRoomDetails() {
    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        return this.roomService.getRoom(id);
      })
    ).subscribe({
      next: (room) => {
        this.room = {
          ...room,
          picture: room.picture ? `${this.backendUrl}${room.picture}` : ''
        };
      },
      error: (err) => console.error('Failed to load room details', err)
    });
  }

  goBack(): void {
    this.location.historyGo(-2);
  }
}
