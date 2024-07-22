import {Component, OnInit} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {RoomsComponent} from "../rooms/rooms.component";
import {AudioService} from "../sound-control/audio.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage, RouterOutlet, RoomsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    const audioURL = './assets/entrance_teun_hilbers.mp3';
    this.audioService.playAudio(audioURL)
  }
}
