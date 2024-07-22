import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { NgClass } from "@angular/common";
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AudioService } from './audio.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sound-control',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './sound-control.component.html',
  styleUrl: './sound-control.component.css'
})
export class SoundControlComponent implements OnInit, OnDestroy {
  isMuted: boolean = true;
  volume: number = 50;
  private subscriptions: Subscription[] = [];
  audioInitialized: boolean = false;


  constructor(
    private snackBar: MatSnackBar,
    private viewContainerRef: ViewContainerRef,
    private audioService: AudioService
  ) { }

  ngOnInit(): void {
    const muteSub = this.audioService.getMuted().subscribe(muted => this.isMuted = muted);
    const volumeSub = this.audioService.getVolume().subscribe(volume => this.volume = volume);
    this.subscriptions.push(muteSub, volumeSub);
  }

  toggleMute(): void {
    if (!this.audioInitialized) {
      this.audioService.initializeAudio();
      this.audioInitialized = true;
    }
    this.audioService.setMuted(!this.isMuted);
  }

  onVolumeChange(event: Event): void {
    const newVolume = (event.target as HTMLInputElement).valueAsNumber;
    this.audioService.setVolume(newVolume);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.showTooltip();
    }, 1000);
  }

  showTooltip(): void {
    const config: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar', 'mat-elevation-z6'],
      viewContainerRef: this.viewContainerRef
    };
    this.snackBar.open('The site is more fun with sounds turned on!', '', config);
  }
}
