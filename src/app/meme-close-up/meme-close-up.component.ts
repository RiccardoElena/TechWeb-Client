import { Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentedMeme } from '../_types/meme.types';
import { CardInfoComponent } from "../_internalComponents/card-info/card-info.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommentCardComponent } from '../_internalComponents/comment-card/comment-card.component';
import { Location } from '@angular/common';
import { faClose, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { MemesService } from '../_services/meme/memes.service';
import { EnrichedComment } from '../_types/comment.types';
import { CommentsService } from '../_services/comments/comments.service';
import { AuthService } from '../_services/auth/local-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meme-close-up',
  imports: [CardInfoComponent, CommentCardComponent, FontAwesomeModule],
  templateUrl: './meme-close-up.component.html',
  styleUrl: './meme-close-up.component.scss'
})
export class MemeCloseUpComponent {

  constructor(private titleService: Title, private route: ActivatedRoute) {
  }

  icons = {
    close: faClose, delete: faTrash, edit: faPencil
  };

  meme: CommentedMeme | null = null;


  moreComments = [];

  locationService = inject(Location);
  memeService = inject(MemesService);
  router = inject(Router);
  authService = inject(AuthService);
  commentService = inject(CommentsService); // Assuming the service is the same for comments

  commentCurrentPage = signal(0);
  commentPageSize = signal(5);
  comments = signal<EnrichedComment[]>([]);
  totalNumberOfComments = signal(0);
  hasMoreComments = computed(() => {
    return this.comments().length < (this.meme?.commentsNumber || 0);
  });
  liked = signal<boolean | undefined>(undefined);
  showFullDcp = false;


  ngOnInit() {
    const memeId = this.route.snapshot.paramMap.get('id');

    console.log('Meme ID:', memeId);

    this.memeService.getMemeById(memeId!).subscribe({
      next: (meme) => {
        this.meme = meme;
        this.commentCurrentPage.set(this.meme.commentsPagination.page + 1);
        this.commentPageSize.set(this.meme.commentsPagination.limit);
        this.comments.set(this.meme.comments);
        this.liked.set(this.meme.MemeVotes[0]?.isUpvote);
        console.log('like', this.liked());
        this.totalNumberOfComments.set(this.meme.commentsPagination.totalCount);
        this.titleService.setTitle(`${this.meme.title}| TechWeb Meme Museum`);
        console.log('Fetched meme:', this.meme);
      },
      error: (error) => {
        console.error('Error fetching meme:', error);
        this.router.navigate(['/404']); // Navigate to a 404 page if meme not found
      }
    });

  }

  goBack() {
    this.locationService.back();
  }

  toggleShowFullDcp() {
    this.showFullDcp = !this.showFullDcp;
  }

  async deleteMeme($event: MouseEvent) {
    $event.stopPropagation();
    if (!this.meme) {
      return; // Ensure meme is defined before proceeding
    }
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
          if (!this.meme) {
            return; // Ensure meme is defined before proceeding
          }
          Swal.fire({
            title: 'Deleted!',
            text: `The meme "${this.meme.title}" has been deleted successfully.`,
            icon: 'success',
            customClass: {
              popup: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-300',
              confirmButton: '!bg-green-600 !text-white'
            }
          }).then(() => {
            this.goBack();
          });
        },
        error: (error) => {
          console.error('Error deleting meme:', error);
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

    console.log(result);

  }

  commentDeleted(commentId: string) {
    this.comments.update(currentComments => currentComments.filter(comment => comment.id !== commentId));
    this.totalNumberOfComments.set(this.totalNumberOfComments() - 1);
  }

  editMeme($event: MouseEvent) {
    $event.stopPropagation();
    this.router.navigate(['/memes', this.meme?.id, 'edit']);
  }

  loadMore() {
    this.commentCurrentPage.set(this.commentCurrentPage() + 1);
    // Here you would typically call a service to fetch more comments
    console.log('Loading more comments for page:', this.commentCurrentPage());
    // For demonstration, we will just append more comments to the existing ones
    this.comments.update(currentComments => [
      ...currentComments,
      ...this.moreComments
    ]);
  }

  voteMeme(vote: boolean) {
    if (!this.meme) {
      return;
    }

    this.memeService.voteMeme(this.meme.id, vote).subscribe({
      next: (updatedMeme) => {
        console.log('Meme voted successfully:', updatedMeme);
        if (!this.meme) {
          return;
        }
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
        console.error('Error voting meme:', error);
      }
    });

  }

  handleUpvoteClick() {
    if (!this.meme) {
      return; // Ensure meme is defined before proceeding
    }
    if (this.liked()) {
      this.unvoteMeme();
    } else {
      this.voteMeme(true);
    }
  }

  handleDownvoteClick() {
    if (!this.meme) {
      return; // Ensure meme is defined before proceeding
    }
    if (this.liked() === false) {
      this.unvoteMeme();
    } else {
      this.voteMeme(false);
    }
  }

  unvoteMeme() {
    if (!this.meme) {
      return; // Ensure meme is defined before proceeding
    }
    this.memeService.unvoteMeme(this.meme.id).subscribe({
      next: () => {
        console.log('Meme unvoted successfully');
        if (!this.meme) {
          return; // Ensure meme is defined before proceeding
        }
        if (this.liked() === false) {
          this.meme.downvotesNumber--;
        } else if (this.liked() === true) {
          this.meme.upvotesNumber--;
        }
        this.liked.set(undefined); // Reset liked state
      },
      error: (error) => {
        console.error('Error unvoting meme:', error);
      }
    });
    // call the service to unvote the meme

  }



  handleCommentSubmit(comment: string) {
    if (!this.meme) {
      return; // Ensure meme is defined before proceeding
    }
    if (comment.trim() === '') {
      return; // Do not submit empty comments
    }
    this.commentService.createComment(this.meme.id, comment).subscribe({
      next: (newComment) => {
        console.log('Comment created successfully:', newComment);
        newComment.CommentVotes = []; // Initialize CommentVotes to an empty array
        newComment.User = {
          userName: this.authService.getUser() || '',
          id: this.authService.getUserId() || ''
        }
        this.comments.update(currentComments => [newComment, ...currentComments]);
        this.totalNumberOfComments.update(count => count + 1);
      },
      error: (error) => {
        console.error('Error creating comment:', error);
      }
    });
  }
}
