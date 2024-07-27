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
  backendUrl = 'http://localhost:3000';  // Add this line


  constructor(private paintingService: PaintingService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['roomId'] && changes['roomId'].currentValue !== undefined) {
      this.loadPaintings();
    }
  }

  loadPaintings() {
    if (this.roomId === undefined || isNaN(this.roomId) || this.roomId <= 0) {
      console.error('Invalid room ID:', this.roomId);
      return;
    }

    this.paintingService.getPaintingsByRoom(this.roomId).subscribe({
      next: (data) => {
        console.log('Paintings loaded:', data);
        this.paintings = data.map(painting => ({
          ...painting,
          picture: painting.picture ? `${this.backendUrl}${painting.picture}` : ''
        }));
      },
      error: (err) => {
        console.error('Failed to load paintings:', err);
      }
    });
  }
}
