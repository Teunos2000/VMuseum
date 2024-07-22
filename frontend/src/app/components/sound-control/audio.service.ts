// In audio.service.ts
import { BehaviorSubject } from 'rxjs';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audio = new Audio();
  private isInitialized = false;
  private muted$ = new BehaviorSubject<boolean>(true);
  private volume$ = new BehaviorSubject<number>(50);
  private pendingUrl: string | null = null; // Store the URL if initialization hasn't happened yet

  constructor() { }

  initializeAudio() {
    this.audio.addEventListener('ended', () => {
      this.audio.pause();
      this.audio.currentTime = 0;
    });
    this.isInitialized = true;

    // Check if there is a pending URL to play
    if (this.pendingUrl) {
      this.playAudio(this.pendingUrl);
      this.pendingUrl = null; // Clear the pending URL
    }
  }

  playAudio(url: string) {
    if (!this.isInitialized) {
      console.log("Audio not initialized, storing URL for later playback:", url);
      this.pendingUrl = url; // Store URL to play after initialization
      return;
    }
    this.audio.src = url;
    this.audio.load();
    this.audio.play();
  }

  stopAudio() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setMuted(muted: boolean) {
    this.muted$.next(muted);
    this.audio.muted = muted;
  }

  setVolume(volume: number) {
    this.volume$.next(volume);
    this.audio.volume = volume / 100;
  }

  getMuted() {
    return this.muted$.asObservable();
  }

  getVolume() {
    return this.volume$.asObservable();
  }
}
