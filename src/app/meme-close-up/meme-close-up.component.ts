import { Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentedMeme } from '../_types/meme.types';
import { CardInfoComponent } from "../_internalComponents/card-info/card-info.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Location } from '@angular/common';
import { faClose, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { MemesService } from '../_services/meme/memes.service';
import { EnrichedComment } from '../_types/comment.types';
import { CommentsService } from '../_services/comments/comments.service';
import { AuthService } from '../_services/auth/local-auth.service';
import Swal from 'sweetalert2';
import { CommentListComponent } from '../_internalComponents/comment-list/comment-list.component';
import { NavigationService } from '../_services/navigation/navigation.service';

@Component({
  selector: 'app-meme-close-up',
  imports: [CardInfoComponent, CommentListComponent, FontAwesomeModule, CommentListComponent],
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

  navigationService = inject(NavigationService);
  memeService = inject(MemesService);
  router = inject(Router);
  authService = inject(AuthService);
  commentService = inject(CommentsService);
  id: string | undefined;

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
    this.route.params.subscribe({
      next: (params) => {
        this.id = params['id'];

        if (this.id) {

          this.memeService.getMemeById(this.id, this.commentCurrentPage(), this.commentPageSize()).subscribe({
            next: (meme) => {
              this.meme = meme;
              this.commentCurrentPage.set(this.meme.commentsPagination.page + 1);
              this.commentPageSize.set(this.meme.commentsPagination.limit);
              this.comments.set(this.meme.comments);
              this.liked.set(this.meme.MemeVotes?.[0]?.isUpvote);
              this.totalNumberOfComments.set(this.meme.commentsPagination.totalCount);
              this.titleService.setTitle(`${this.meme.title} | TechWeb Meme Museum`);
            },
            error: (error) => {

              this.router.navigate(['/404']);
            }
          });
        } else {

          this.router.navigate(['/404']);
        }
      },
      error: (error) => {

        this.router.navigate(['/404']);
      }
    });


  }

  goBack() {
    this.navigationService.navigateAndPop();
  }

  toggleShowFullDcp() {
    this.showFullDcp = !this.showFullDcp;
  }

  clampDescription(text: string, maxLength: number = 100): string {
    if (!text) return '';
    const a = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

    return a;
  }

  async deleteMeme($event: MouseEvent) {
    $event.stopPropagation();
    if (!this.meme) {
      return;
    }
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the meme "${this.clampDescription(this.meme.title)}"? This action cannot be undone.`,
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
            return;
          }
          Swal.fire({
            title: 'Deleted!',
            text: `The meme "${this.clampDescription(this.meme.title)}" has been deleted successfully.`,
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

  commentDeleted(commentId: string) {
    this.comments.update(currentComments => currentComments.filter(comment => comment.id !== commentId));
    this.totalNumberOfComments.set(this.totalNumberOfComments() - 1);
  }

  editMeme($event: MouseEvent) {
    $event.stopPropagation();
    this.router.navigate(['/memes', this.meme?.id, 'edit']);
  }

  loadMore() {

    if (!this.hasMoreComments()) return;
    if (!this.id) return;
    this.memeService.getMemeById(this.id, this.commentCurrentPage(), this.commentPageSize())
      .subscribe(
        {
          next: (meme) => {
            this.comments.update(currentComments => [
              ...currentComments,
              ...meme.comments
            ]);
            this.commentCurrentPage.set(meme.commentsPagination.page + 1)
            this.totalNumberOfComments.set(meme.commentsPagination.totalCount);
            this.commentPageSize.set(meme.commentsPagination.limit)

          }
        }

      )

  }

  voteMeme(vote: boolean) {
    if (!this.meme) {
      return;
    }

    this.memeService.voteMeme(this.meme.id, vote).subscribe({
      next: (updatedMeme) => {

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

      }
    });

  }

  handleUpvoteClick() {
    if (!this.meme) {
      return;
    }
    if (this.liked()) {
      this.unvoteMeme();
    } else {
      this.voteMeme(true);
    }
  }

  handleDownvoteClick() {
    if (!this.meme) {
      return;
    }
    if (this.liked() === false) {
      this.unvoteMeme();
    } else {
      this.voteMeme(false);
    }
  }

  unvoteMeme() {
    if (!this.meme) {
      return;
    }
    this.memeService.unvoteMeme(this.meme.id).subscribe({
      next: () => {

        if (!this.meme) {
          return;
        }
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
    if (!this.meme) {
      return;
    }
    if (comment.trim() === '') {
      return;
    }
    this.commentService.createComment(this.meme.id, comment).subscribe({
      next: (newComment) => {

        newComment.CommentVotes = [];
        newComment.User = {
          userName: this.authService.getUser() || '',
          id: this.authService.getUserId() || ''
        }
        this.comments.update(currentComments => [newComment, ...currentComments]);
        this.totalNumberOfComments.update(count => count + 1);
      },
      error: (error) => {

      }
    });
  }
}
