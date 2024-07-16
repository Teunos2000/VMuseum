import { Component } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  paintingDescription: string = '';
  roomDescription: string = '';


  submitRoom() {
    return;
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

  submitPainting() {
    // Implement your submission logic here
    console.log('Submitting painting:', this.paintingDescription);
  }
}
