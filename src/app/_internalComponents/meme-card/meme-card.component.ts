import { Component, effect, inject, input, output, signal } from '@angular/core';
import { EnrichedMeme } from '../../_types/meme.types';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../_services/auth/local-auth.service';
import { CardInfoComponent } from "../card-info/card-info.component";
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { MemesService } from '../../_services/meme/memes.service';
import { CommentsService } from '../../_services/comments/comments.service';

@Component({
  selector: 'app-meme-card',
  imports: [FontAwesomeModule, RouterLink, FormsModule, CardInfoComponent],
  templateUrl: './meme-card.component.html',
  styleUrl: './meme-card.component.scss'
})

export class MemeCardComponent {

  meme: EnrichedMeme;
  constructor() {
    effect(() => {
      const inputMeme = this.inputMeme();

      if (inputMeme) {
        this.meme = inputMeme;
        if (this.meme.MemeVotes && this.meme.MemeVotes.length > 0) {
          this.liked.set(inputMeme.MemeVotes[0].isUpvote);
        } else {
          this.liked.set(undefined);
        }
      }
    });
  }

  icons = {
    delete: faTrash,
    edit: faPencil
  };

  router = inject(Router);
  authService = inject(AuthService);
  memeService = inject(MemesService);
  commentService = inject(CommentsService);

  memeDeleted = output<string>();
  inputMeme = input<EnrichedMeme>();
  liked = signal<boolean | undefined>(undefined);

  async deleteMeme($event: MouseEvent) {
    $event.stopPropagation();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the meme "${this.meme.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      customClass: {
        popup: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-300',
        icon: '!text-red-600 !border-red-600 dark:!text-red-400 dark:!border-red-400',
        confirmButton: '!bg-red-600 !text-white',
        cancelButton: '!bg-gray-300 !text-gray-800'
      }
    });

    if (result.isConfirmed) {
      this.memeService.deleteMeme(this.meme.id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Deleted!',
            text: `The meme "${this.meme.title}" has been deleted successfully.`,
            icon: 'success',
            customClass: {
              popup: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-300',
              confirmButton: '!bg-green-600 !text-white'
            }
          }).then(() => {
            this.memeDeleted.emit(this.meme.id);
          });
        },
        error: (error) => {

          Swal.fire({
            title: 'Error!',
            text: `An error occurred while deleting the meme`,
            icon: 'error',
            customClass: {
              popup: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-300',
              confirmButton: '!bg-red-600 !text-white'
            }
          });
        }
      });

    }



  }

  editMeme($event: MouseEvent) {
    $event.stopPropagation();
    this.router.navigate(['/memes', this.meme.id, 'edit']);
  }

  preventDefaultLink(event: MouseEvent) {
    event.stopPropagation();
  }


  voteMeme(vote: boolean) {

    this.memeService.voteMeme(this.meme.id, vote).subscribe({
      next: (updatedMeme) => {
        if (vote) {
          this.meme.upvotesNumber++;
        }
        else {
          this.meme.downvotesNumber++;
        }
        if (this.liked() === false) {
          this.meme.downvotesNumber--;
        } else if (this.liked() === true) {
          this.meme.upvotesNumber--;
        }
        this.liked.set(vote);

      },
      error: (error) => {

      }
    });

  }

  handleUpvoteClick() {

    if (this.liked()) {
      this.unvoteMeme();
    } else {
      this.voteMeme(true);
    }
  }

  handleDownvoteClick() {

    if (this.liked() === false) {
      this.unvoteMeme();
    } else {
      this.voteMeme(false);
    }
  }

  unvoteMeme() {
    this.memeService.unvoteMeme(this.meme.id).subscribe({
      next: () => {
        if (this.liked() === false) {
          this.meme.downvotesNumber--;
        } else if (this.liked() === true) {
          this.meme.upvotesNumber--;
        }
        this.liked.set(undefined);
      },
      error: (error) => {

      }
    });

  }

  handleCommentSubmit(comment: string) {
    const trimmedComment = comment.trim();
    if (trimmedComment === '') {
      return;
    }

    this.commentService.createComment(this.meme.id, trimmedComment).subscribe({
      next: (newComment) => {

        this.meme.commentsNumber++;
      },
      error: (error) => {

      }
    });


  }

  expandCard() {
    this.router.navigate(['/memes', this.meme.id])
  }

}
