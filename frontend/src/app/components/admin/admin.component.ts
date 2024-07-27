import {Component, OnInit} from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from './admin.service';
import { forkJoin } from 'rxjs';
import { customSwal } from '../../utils/custom-swal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  // Room
  roomName: string = '';
  roomDescription: string = '';
  roomCapacity: number = 0;
  roomSubject: string = '';
  roomStyle: string = '';
  roomPicture: File | null = null;
  roomMusic: File | null = null;
  roomVoiceover: File | null = null;

  // Painting
  paintingName: string = '';
  paintingDescription: string = '';
  selectedRoomId: number | null = null;
  paintingPicture: File | null = null;

  //Array for rooms
  rooms: any[] = [];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.adminService.getAllRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (error) => {
        console.error('Error loading rooms', error);
        customSwal({
          icon: 'error',
          title: 'Error Loading Rooms',
          text: 'There was an error loading the rooms. Please try again.',
          confirmButtonText: 'Okay'
        });
      }
    });
  }

  onFileChange(event: any, fileType: 'picture' | 'music' | 'voiceover') {
    const file = event.target.files[0];
    if (file) {
      switch (fileType) {
        case 'picture':
          this.roomPicture = file;
          break;
        case 'music':
          this.roomMusic = file;
          break;
        case 'voiceover':
          this.roomVoiceover = file;
          break;
      }
    }
  }

  submitRoom() {
    const roomData = {
      name: this.roomName,
      description: this.roomDescription,
      capacity: this.roomCapacity,
      subject: this.roomSubject,
      style: this.roomStyle
    };

    this.adminService.createRoom(roomData).subscribe({
      next: (room) => {
        console.log('Room created successfully', room);
        this.uploadFiles(room.id);
      },
      error: (error) => {
        console.error('Error creating room', error);
        customSwal({
          icon: 'error',
          title: 'Error Creating Room',
          text: 'There was an error creating the room. Please try again.',
          confirmButtonText: 'Okay'
        });
      }
    });
  }

  uploadFiles(roomId: number) {
    const uploadObservables = [];

    if (this.roomPicture && this.isValidFile(this.roomPicture)) {
      uploadObservables.push(this.adminService.uploadRoomPicture(roomId, this.roomPicture));
    }
    if (this.roomMusic && this.isValidFile(this.roomMusic)) {
      uploadObservables.push(this.adminService.uploadRoomMusic(roomId, this.roomMusic));
    }
    if (this.roomVoiceover && this.isValidFile(this.roomVoiceover)) {
      uploadObservables.push(this.adminService.uploadRoomVoiceover(roomId, this.roomVoiceover));
    }

    if (uploadObservables.length > 0) {
      forkJoin(uploadObservables).subscribe({
        next: (results) => {
          console.log('All files uploaded successfully', results);
          this.resetForm();
          customSwal({
            icon: 'success',
            title: 'Room Created Successfully!',
            text: 'All files uploaded successfully.',
            confirmButtonText: 'Great!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/']);
            }
          });
        },
        error: (error) => {
          console.error('Error uploading files', error);
          customSwal({
            icon: 'error',
            title: 'Error Uploading Files',
            text: 'There was an error uploading the files. Please try again.',
            confirmButtonText: 'Okay'
          });
        }
      });
    } else {
      this.resetForm();
      customSwal({
        icon: 'success',
        title: 'Room Created Successfully!',
        text: 'Room created without any files.',
        confirmButtonText: 'Great!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/']);
        }
      });
    }
  }

  private isValidFile(file: any): file is File {
    return file && typeof file === 'object' && 'name' in file && 'size' in file && 'type' in file;
  }

  resetForm() {
    this.roomName = '';
    this.roomDescription = '';
    this.roomCapacity = 0;
    this.roomSubject = '';
    this.roomStyle = '';
    this.roomPicture = null;
    this.roomMusic = null;
    this.roomVoiceover = null;
    // Reset file inputs
    (document.getElementById('roomphoto') as HTMLInputElement).value = '';
    (document.getElementById('roommusic') as HTMLInputElement).value = '';
    (document.getElementById('roomvoice') as HTMLInputElement).value = '';
  }

  /** Painting code */
  onPaintingFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.paintingPicture = file;
    }
  }

  submitPainting() {
    if (this.selectedRoomId === null) {
      customSwal({
        icon: 'error',
        title: 'Room Selection Required',
        text: 'Please select a room for the painting.',
        confirmButtonText: 'Okay'
      });
      return;
    }

    const paintingData = {
      name: this.paintingName,
      description: this.paintingDescription,
      Room_id: this.selectedRoomId,
      views: 0 // Initialize views to 0
    };

    this.adminService.createPainting(paintingData).subscribe({
      next: (painting) => {
        console.log('Painting created successfully', painting);
        if (this.paintingPicture) {
          this.uploadPaintingPicture(painting.id);
        } else {
          this.resetPaintingForm();
          customSwal({
            icon: 'success',
            title: 'Painting Created Successfully!',
            text: 'Painting created without a picture.',
            confirmButtonText: 'Great!'
          });
        }
      },
      error: (error) => {
        console.error('Error creating painting', error);
        customSwal({
          icon: 'error',
          title: 'Error Creating Painting',
          text: 'There was an error creating the painting. Please try again.',
          confirmButtonText: 'Okay'
        });
      }
    });
  }

  uploadPaintingPicture(paintingId: number) {
    if (this.paintingPicture && this.isValidFile(this.paintingPicture)) {
      this.adminService.uploadPaintingPicture(paintingId, this.paintingPicture).subscribe({
        next: (result) => {
          console.log('Painting picture uploaded successfully', result);
          this.resetPaintingForm();
          customSwal({
            icon: 'success',
            title: 'Painting Created Successfully!',
            text: 'Painting and picture uploaded successfully.',
            confirmButtonText: 'Great!'
          });
        },
        error: (error) => {
          console.error('Error uploading painting picture', error);
          customSwal({
            icon: 'error',
            title: 'Error Uploading Painting Picture',
            text: 'There was an error uploading the painting picture. Please try again.',
            confirmButtonText: 'Okay'
          });
        }
      });
    }
  }

  resetPaintingForm() {
    this.paintingName = '';
    this.paintingDescription = '';
    this.selectedRoomId = null;
    this.paintingPicture = null;
    // Reset file input
    (document.getElementById('paintingphoto') as HTMLInputElement).value = '';
  }

  formatText(type: 'bold' | 'header' | 'list') {
    const textarea: HTMLTextAreaElement | null = document.querySelector('textarea[name="paintingDescription"]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.paintingDescription.substring(start, end);

    let formattedText = '';
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'header':
        formattedText = `# ${selectedText}`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText}`;
        break;
    }

    this.paintingDescription = this.paintingDescription.substring(0, start) + formattedText + this.paintingDescription.substring(end);

    // Set focus back to textarea and update cursor position
    textarea.focus();
    textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
  }
}
