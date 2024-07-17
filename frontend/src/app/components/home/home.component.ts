import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {RoomsComponent} from "../rooms/rooms.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage, RouterOutlet, RoomsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
