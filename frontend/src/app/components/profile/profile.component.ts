import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from "@angular/forms";
import { NgIf, NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";
import { UserService } from "../../auth/user.service";
import { AuthService } from "../../auth/auth.service";
import { customSwal } from '../../utils/custom-swal';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  username: string = '';
  email: string = '';
  profilepicture: string = '';
  rank: number = 0;
  profileImageUrl: string | null = null;
  croppingImageUrl: string | null = null;
  newusername: string = '';
  updateForm: FormGroup;

  @ViewChild('image') imageElement: ElementRef | undefined;
  private cropper: Cropper | undefined;
  isCropping: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.updateForm = this.fb.group({
      newUsername: ['', [Validators.minLength(4)]],
      newPassword: ['', [Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{4,}$/)]],
      repeatPassword: ['']
    });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  ngAfterViewInit() {
    // Initialize cropper if there's an initial image
    if (this.isCropping) {
      this.initCropper();
    }
  }

  initCropper() {
    if (this.cropper) {
      this.cropper.destroy();
    }
    if (this.imageElement && this.imageElement.nativeElement) {
      this.cropper = new Cropper(this.imageElement.nativeElement, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        minCropBoxWidth: 200,
        minCropBoxHeight: 200,
        crop: (event) => {
          const canvas = this.cropper?.getCroppedCanvas({
            width: 200,
            height: 200,
          });
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.beginPath();
              ctx.arc(100, 100, 100, 0, Math.PI * 2);
              ctx.clip();
            }
          }
        }
      });
    }
  }

  loadUserProfile() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserProfile(userId).subscribe(
        (user) => {
          console.log('Full user object:', user);
          const backendUrl = 'http://localhost:3000';
          this.username = user.username;
          this.email = user.email;
          this.profilepicture = user.profilepicture ? `${backendUrl}${user.profilepicture}` : '';
          this.rank = user.rank;
          this.profileImageUrl = this.profilepicture;
        },
        (error) => {
          console.error('Error loading user profile:', error);
        }
      );
    } else {
      console.error('No user ID found');
    }
  }

  onSubmit() {
    if (this.updateForm.invalid) {
      const passwordControl = this.updateForm.get('newPassword');
      if (passwordControl?.invalid && passwordControl?.touched) {
        if (passwordControl.errors?.['pattern']) {
          customSwal({
            icon: 'error',
            title: 'Weak Password',
            text: 'Password must be at least 4 characters long, include at least one uppercase letter and one number.',
            confirmButtonText: 'OK',
          });
        }
        return;
      }

      // Check for other form errors if needed
      customSwal({
        icon: 'error',
        title: 'Invalid Form',
        text: 'Please check your inputs and try again.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    const newUsername = this.updateForm.get('newUsername')?.value;
    const newPassword = this.updateForm.get('newPassword')?.value;
    const repeatPassword = this.updateForm.get('repeatPassword')?.value;

    if (!newUsername && !newPassword) {
      customSwal({
        icon: 'info',
        title: 'No Changes',
        text: 'No changes were made to your profile.',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (newUsername) {
      this.userService.checkUsernameAvailability(newUsername).subscribe(
        response => {
          if (response.available) {
            this.updateProfile(userId, newUsername, newPassword, repeatPassword);
          } else {
            customSwal({
              icon: 'error',
              title: 'Username Taken',
              text: 'This username is already taken. Please choose another.',
              confirmButtonText: 'OK',
            });
          }
        },
        error => {
          console.error('Error checking username availability', error);
          customSwal({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while checking username availability.',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      this.updateProfile(userId, newUsername, newPassword, repeatPassword);
    }
  }

  private updateProfile(userId: number, newUsername: string, newPassword: string, repeatPassword: string) {
    if (newPassword && newPassword !== repeatPassword) {
      customSwal({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'The passwords do not match.',
        confirmButtonText: 'OK',
      });
      return;
    }

    this.userService.updateUser(userId, newUsername, newPassword).subscribe(
      response => {
        customSwal({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully!',
          confirmButtonText: 'OK',
        });
        this.loadUserProfile();
        this.updateForm.reset();
      },
      error => {
        console.error('Error updating profile', error);
        customSwal({
          icon: 'error',
          title: 'Update Failed',
          text: 'An error occurred while updating your profile.',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.croppingImageUrl = e.target.result;
        this.isCropping = true;
        setTimeout(() => this.initCropper(), 0);
      };
      reader.readAsDataURL(file);
    }
  }

  cropImage() {
    if (this.cropper) {
      const canvas = this.cropper.getCroppedCanvas({
        width: 200,
        height: 200,
      });

      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          const circularCanvas = document.createElement('canvas');
          circularCanvas.width = 200;
          circularCanvas.height = 200;
          const circularCtx = circularCanvas.getContext('2d');

          if (circularCtx) {
            circularCtx.beginPath();
            circularCtx.arc(100, 100, 100, 0, Math.PI * 2);
            circularCtx.clip();
            circularCtx.drawImage(canvas, 0, 0, 200, 200);

            circularCanvas.toBlob((blob) => {
              if (blob) {
                const file = new File([blob], "cropped_profile.png", {type: "image/png"});
                this.uploadProfilePicture(file);
                this.isCropping = false;
              }
            }, 'image/png');
          }
        }
      }
    }
  }

  cancelCrop() {
    this.isCropping = false;
    this.croppingImageUrl = null;
  }

  uploadProfilePicture(file: File): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('No user ID found');
      return;
    }

    this.userService.uploadProfilePicture(file, userId).subscribe(
      response => {
        console.log('Upload successful', response);
        if (response && response.filePath) {
          const backendUrl = 'http://localhost:3000';
          this.profileImageUrl = `${backendUrl}${response.filePath}`;
          this.profilepicture = this.profileImageUrl;
          this.loadUserProfile(); // Reload user profile to get updated data
          customSwal({
            icon: 'success',
            title: 'Profile Picture Updated',
            text: 'Your profile picture has been updated successfully!',
            confirmButtonText: 'OK',
          });
        } else {
          customSwal({
            icon: 'error',
            title: 'Upload Failed',
            text: 'Failed to get file path from server',
            confirmButtonText: 'Try Again',
          });
        }
      },
      error => {
        console.error('Error uploading profile picture', error);
        customSwal({
          icon: 'error',
          title: 'Upload Failed',
          text: 'Image not allowed over 2MB: JPG, JPEG, PNG',
          confirmButtonText: 'Try Again',
        });
      }
    );
  }
}
