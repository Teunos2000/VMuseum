import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Room } from "../rooms/room.model";
import { RoomService } from "../rooms/room.service";
import { ActivatedRoute } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { AudioService } from '../sound-control/audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-intro',
  standalone: true,
  imports: [NgIf],
  templateUrl: './room-intro.component.html',
  styleUrls: ['./room-intro.component.css']
})
export class RoomIntroComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayer: ElementRef<HTMLAudioElement> | undefined;
  room: Room = {} as Room;
  imageUrl: string | undefined = '';
  musicURL: string = '';
  backendUrl = 'http://localhost:3000';
  private audioSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
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
        this.imageUrl = this.room.picture; // Assign image URL for use in the template
        const musicURL = room.music ? `${this.backendUrl}${room.music}` : '';
        if (musicURL) {
          this.audioService.playAudio(musicURL);
        }
      },
      error: (err) => console.error('Failed to load room details', err)
    });
  }

  ngOnDestroy() {
    if (this.audioSubscription) {
      this.audioSubscription.unsubscribe();
    }
  }

  private loadRoomDetails(id: number) {
    return this.roomService.getRoom(id);
  }
}
