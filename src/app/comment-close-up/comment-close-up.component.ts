import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommentsService } from '../_services/comments/comments.service';
import { CommentListComponent } from "../_internalComponents/comment-list/comment-list.component";
import { EnrichedComment } from '../_types/comment.types';
import { RouterLink } from '@angular/router';
import { CardInfoComponent } from "../_internalComponents/card-info/card-info.component";
import { AuthService } from '../_services/auth/local-auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faArrowLeft, faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { StringManipulationService } from '../_services/stringManipulation/string-manipulation.service';

@Component({
  selector: 'app-comment-close-up',
  imports: [CommentListComponent, RouterLink, CardInfoComponent, FontAwesomeModule, FormsModule],
  templateUrl: './comment-close-up.component.html',
  styleUrl: './comment-close-up.component.scss'
})
export class CommentCloseUpComponent {

  route = inject(ActivatedRoute);
  router = inject(Router);
  commentService = inject(CommentsService);
  authService = inject(AuthService);
  stringService = inject(StringManipulationService);

  icons = {
    delete: faTrash,
    edit: faPencil,
    close: faClose,
    back: faArrowLeft
  };

  memeId: string | null = null;
  commentId: string | null = null;
  comment = signal<EnrichedComment | null>(null);
  parentCommentId = computed(() => this.comment()?.parentId || null);
  upvotesNumber = computed(() => this.comment()?.upvotesNumber || 0);
  downvotesNumber = computed(() => this.comment()?.downvotesNumber || 0);
  replies = signal<EnrichedComment[]>([]);
  currentPage = signal(0);
  pageSize = signal(5);
  totalNumberOfReplies = signal(0);
  hasMore = computed(() => this.replies().length < this.totalNumberOfReplies());
  liked = signal<boolean | undefined>(undefined);
  isEditing = signal(false);
  newComment = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.replies.set([]);
      this.currentPage.set(0);

      this.commentId = params['commentId'];
      this.memeId = params['memeId'];
      if (!this.commentId || !this.memeId) {

        this.router.navigate(['/404']);
        return;
      }

      this.fetchReplies(this.memeId, this.commentId);

    });
  }

  captureClick(event: MouseEvent) {
    event.stopPropagation();
  }

  loadMoreReplies() {
    if (!this.memeId || !this.commentId) {

      return;
    }
    if (this.hasMore()) {
      this.fetchReplies(this.memeId, this.commentId);
    }
  }

  submitEditedComment(event: Event) {
    event.stopPropagation();
    const currentComment = this.comment();
    if (!currentComment) {

      return;
    }
    const trimmedComment = this.newComment.trim();
    if (trimmedComment === '') {

      return;
    }
    this.commentService.updateComment(currentComment.MemeId, currentComment.id, trimmedComment).subscribe({
      next: (updatedComment) => {

        this.comment.set(updatedComment);
        this.isEditing.set(false);
        this.newComment = '';
      },
      error: (error) => {

      }
    });
  }

  editComment(event: MouseEvent) {
    event.stopPropagation();
    this.newComment = this.comment()?.content || '';
    this.isEditing.set(!this.isEditing());
  }



  private fetchReplies(
    memeId: string,
    commentId: string,
    page: number = this.currentPage(),
    size: number = this.pageSize()
  ) {
    this.commentService.getReplies(memeId, commentId, page, size).subscribe({
      next: (comment) => {
        if (!comment) {

          this.router.navigate(['/404']);
          return;
        }
        this.comment.set(comment.data.parent);
        this.currentPage.update(value => value + 1);
        this.liked.set(comment.data.parent.CommentVotes[0]?.isUpvote);
        this.pageSize.set(comment.pagination.limit);
        this.replies.update(replies => [...replies, ...comment.data.replies]);
        this.totalNumberOfReplies.set(comment.pagination.totalCount);


      },
      error: (error) => {

        this.router.navigate(['/404']);
      }
    });
  }

  async deleteComment($event: MouseEvent) {
    $event.stopPropagation();

    const comment = this.comment();
    if (!comment) {
      return;
    }
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the comment "${this.stringService.clampStringToLength(comment.content, 100)}"? This action cannot be undone.`,
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
      this.commentService.deleteComment(comment.MemeId, comment.id).subscribe({
        next: () => {
          const comment = this.comment();
          if (!comment) {
            return;
          }
          Swal.fire({
            title: 'Deleted!',
            text: `The comment "${this.stringService.clampStringToLength(comment.content, 100)}" has been deleted successfully.`,
            icon: 'success',
            customClass: {
              popup: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-300',
              confirmButton: '!bg-green-600 !text-white'
            }
          }).then(() => {
            if (this.parentCommentId()) {
              this.router.navigate(['/memes', comment.MemeId, 'comments', this.parentCommentId()]);
            }
            else {
              this.router.navigate(['/memes', comment.MemeId]);
            }
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

  replyDeleted(commentId: string) {

    this.replies.update(replies => replies.filter(reply => reply.id !== commentId));
    this.totalNumberOfReplies.update(count => count - 1);
  }

  voteComment(vote: boolean) {
    const comment = this.comment();
    if (!comment) {
      return;
    }

    this.commentService.voteComment(comment.MemeId, comment.id, vote).subscribe({
      next: (updatedComment) => {

        if (!this.comment()) {
          return;
        }
        if (vote) {
          this.comment.update(c => c ? ({
            ...c,
            upvotesNumber: c.upvotesNumber + 1
          }) : null);
        }
        else {
          this.comment.update(c => c ? ({
            ...c,
            downvotesNumber: c.downvotesNumber + 1
          }) : null);
        }
        if (this.liked() === false) {
          this.comment.update(c => c ? ({
            ...c,
            downvotesNumber: c.downvotesNumber - 1
          }) : null);
        } else if (this.liked() === true) {
          this.comment.update(c => c ? ({
            ...c,
            upvotesNumber: c.upvotesNumber - 1
          }) : null);
        }
        this.liked.set(vote);
      },
      error: (error) => {

      }
    });

  }

  handleUpvoteClick() {
    if (!this.comment()) {
      return;
    }
    if (this.liked()) {
      this.unvoteComment();
    } else {
      this.voteComment(true);
    }
  }

  handleDownvoteClick() {
    if (!this.comment()) {
      return;
    }
    if (this.liked() === false) {
      this.unvoteComment();
    } else {
      this.voteComment(false);
    }
  }

  unvoteComment() {
    const comment = this.comment();
    if (!comment) {
      return;
    }
    this.commentService.unvoteComment(comment.MemeId, comment.id).subscribe({
      next: () => {

        if (!this.comment()) {
          return;
        }
        if (this.liked() === false) {
          this.comment.update(c => c ? ({
            ...c,
            downvotesNumber: c.downvotesNumber - 1
          }) : null);
        } else if (this.liked() === true) {
          this.comment.update(c => c ? ({
            ...c,
            upvotesNumber: c.upvotesNumber - 1
          }) : null);
        }
        this.liked.set(undefined);
      },
      error: (error) => {

      }
    });


  }



  handleCommentSubmit(comment: string) {
    const currentComment = this.comment();
    if (!currentComment) {
      return;
    }
    if (comment.trim() === '') {
      return;
    }
    this.commentService.createComment(currentComment.MemeId, comment, currentComment.id).subscribe({
      next: (newComment) => {

        newComment.CommentVotes = [];
        newComment.User = {
          userName: this.authService.getUser() || '',
          id: this.authService.getUserId() || ''
        }
        this.replies.update(currentComments => [newComment, ...currentComments]);
        this.totalNumberOfReplies.update(count => count + 1);
      },
      error: (error) => {

      }
    });
  }

}
