import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faImage, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../_services/auth/local-auth.service';
import { MemesService } from '../_services/meme/memes.service';

@Component({
  selector: 'app-create-meme',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './create-meme.component.html',
  styleUrl: './create-meme.component.scss'
})
export class CreateMemeComponent {
  maxFileSize: number = 5 * 1024 * 1024; // 5 MB
  previewUrl: string | ArrayBuffer | null = null;
  fileError = false;
  title: string = '';
  currentTag: string = '';
  description: string = '';
  tags: string[] = [];

  authService = inject(AuthService);
  router = inject(Router);
  memeService = inject(MemesService);

  icons = {
    close: faClose,
    image: faImage,
    plus: faPlus
  };

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileError = false;
    if (this.selectedFile && this.selectedFile.size > this.maxFileSize) {
      this.selectedFile = null;
      this.fileError = true;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  handleKey(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'Enter' || key === ',' || key === ' ') {
      event.preventDefault();
      const value = this.currentTag.trim();
      if (value && !this.tags.includes(value)) {
        this.tags.push(value);
      }
      this.currentTag = '';
    }
  }

  createMeme() {
    console.log('Creating meme with title:', this.title.trim());
    const formData = new FormData();
    if (!this.selectedFile) {
      this.fileError = true;
      return;
    }
    if (!this.title.trim()) {
      return;
    }

    formData.append('file', this.selectedFile);
    formData.append('title', this.title.trim());
    formData.append('description', this.description.trim());
    formData.append('tags', this.tags.join(','));
    this.memeService.createMeme(formData).subscribe({
      next: () => {
        console.log('Meme created with data:', {
          title: this.title.trim(),
          description: this.description.trim(),
          tags: this.tags,
          file: this.selectedFile
        });
        this.router.navigate(['/memes/search'], {
          queryParams: {
            userId: this.authService.getUserId(),
          }
        });
      },
      error: (error) => {
        console.error('Error creating meme:', error);
      }
    });

  }
}