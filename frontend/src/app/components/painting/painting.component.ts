import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Painting} from "./painting.model";
import {PaintingService} from "./painting.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'paintings',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './painting.component.html',
  styleUrl: './painting.component.css'
})
export class PaintingsComponent implements OnChanges {
  @Input() roomId?: number;
  paintings: Painting[] = [];

  constructor(private paintingService: PaintingService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['roomId'] && changes['roomId'].currentValue !== undefined) {
      this.loadPaintings();
    }
  }

  loadPaintings() {
    if (this.roomId === undefined || isNaN(this.roomId) || this.roomId <= 0) {
      console.error('Invalid room ID:', this.roomId);
      return; // Exit the function if roomId is invalid
    }

    this.paintingService.getPaintingsByRoom(this.roomId).subscribe({
      next: (data) => {
        console.log('Paintings loaded:', data);
        this.paintings = data;
      },
      error: (err) => {
        console.error('Failed to load paintings:', err);
        // You might want to set an error flag or message here to display to the user
      }
    });
  }
}
