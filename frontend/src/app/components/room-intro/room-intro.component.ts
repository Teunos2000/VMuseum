import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {Room} from "../rooms/room.model";
import {RoomService} from "../rooms/room.service";
import {ActivatedRoute} from "@angular/router";
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-room-intro',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './room-intro.component.html',
  styleUrl: './room-intro.component.css'
})
export class RoomIntroComponent implements OnInit{
  @ViewChild('audioPlayer') audioPlayer: ElementRef<HTMLAudioElement> | undefined;
  room: Room = {} as Room;  // Initialize with an empty object
  imageUrl: string = '';
  musicURL: string = '';
  backendUrl = 'http://localhost:3000';

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        return this.loadRoomDetails(id);
      })
    ).subscribe({
      next: (room) => {
        this.room = {
          ...room,
          picture: room.picture ? `${this.backendUrl}${room.picture}` : ''
        };
        if (room.music) {
          this.musicURL = `${this.backendUrl}${room.music}`;
        }
      },
      error: (err) => console.error('Failed to load room details', err)
    });
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called');
    if (this.audioPlayer) {
      const audio = this.audioPlayer.nativeElement;

      // Attempt to play automatically
      audio.play().then(() => {
        console.log('Auto-play started successfully');
      }).catch(error => {
        console.error('Auto-play was prevented:', error);
        // Show a play button to the user or handle it gracefully
      });
    }
  }

  private onTimeUpdate = () => {
    const audio = this.audioPlayer?.nativeElement;
    if (audio && audio.currentTime < 1) {
      audio.currentTime = 1;
    }
    // Remove the event listener after ensuring we're past 1 second
    if (audio && audio.currentTime >= 1) {
      audio.removeEventListener('timeupdate', this.onTimeUpdate);
    }
  }

  private loadRoomDetails(id: number) {
    return this.roomService.getRoom(id);
  }
}
