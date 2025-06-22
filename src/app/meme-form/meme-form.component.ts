import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faImage, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../_services/auth/local-auth.service';
import { MemesService } from '../_services/meme/memes.service';



@Component({
  selector: 'app-meme-form',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './meme-form.component.html',
  styleUrl: './meme-form.component.scss'
})
export class MemeFormComponent {

  memeId: string | null = null;

  maxFileSize: number = 5 * 1024 * 1024;
  previewUrl: string | ArrayBuffer | null = null;
  fileError = false;
  title: string = '';
  ogTitle: string = '';
  currentTag: string = '';
  description: string = '';
  tags: string[] = [];

  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  memeService = inject(MemesService);

  icons = {
    close: faClose,
    image: faImage,
    plus: faPlus
  };

  ngOnInit() {
    this.memeId = this.route.snapshot.paramMap.get('id');
    if (this.memeId) {
      this.memeService.getMemeById(this.memeId).subscribe({
        next: (meme) => {
          if (meme.User.id !== this.authService.getUserId()) {

            this.router.navigate(['/404']);
            return;
          }
          this.title = meme.title || '';
          this.ogTitle = meme.title || '';
          this.description = meme.description || '';
          this.tags = meme.tags ? meme.tags : [];

          this.previewUrl = meme.filePath;

        },
        error: (error) => {

        }
      });
    }
  }


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

  handleSubmit(event: Event) {
    event.preventDefault();
    if (this.memeId) { this.updateMeme() } else { this.createMeme(); }
  }

  updateMeme() {

    this.memeService.updateMeme(this.memeId!, {
      title: this.title.trim(),
      description: this.description.trim(),
      tags: this.tags,
    }).subscribe({
      next: () => {

        this.router.navigate(['/memes/search'], {
          queryParams: {
            userId: this.authService.getUserId(),
          }
        });
      },
      error: (error) => {


      }
    });
  }

  createMeme() {

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


        this.router.navigate(['/memes/search'], {
          queryParams: {
            userId: this.authService.getUserId(),
          }
        });
      },
      error: (error) => {

      }
    });

  }
}
