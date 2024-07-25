import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
export class RoomDetailsComponent implements OnInit {
  currentPath: string = '';

  constructor(private location: Location, private router: Router) {}

  ngOnInit() {
    this.currentPath = this.router.url;
  }

  goBack(): void {
    this.location.historyGo(-2);
  }
}
