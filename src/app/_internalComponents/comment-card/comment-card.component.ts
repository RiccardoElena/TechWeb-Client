import { Component, effect, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EnrichedComment } from '../../_types/comment.types';
import { CardInfoComponent } from '../card-info/card-info.component';
import { AuthService } from '../../_services/auth/local-auth.service';
import Swal from 'sweetalert2';
import { CommentsService } from '../../_services/comments/comments.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comment-card',
  imports: [RouterLink, CardInfoComponent, FontAwesomeModule, FormsModule],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})

export class CommentCardComponent {

  inputComment = input<EnrichedComment>();
  comment = signal<EnrichedComment | null>(null);
  liked = signal<boolean | undefined>(undefined);
  commentDeleted = output<string>();

  newComment = '';
  isEditing = false;

  authService = inject(AuthService);
  commentService = inject(CommentsService);
  router = inject(Router);
  toastr = inject(ToastrService);

  icons = {
    delete: faTrash,
    edit: faPencil
  };

  constructor() {
    effect(() => {
      const inputComment = this.inputComment();
      console.log('Input comment changed:', inputComment);
      if (inputComment) {
        console.log('Input comment:', inputComment);
        this.comment.set(inputComment);
        this.liked.set(inputComment.CommentVotes[0]?.isUpvote);
      }
    });
  }

  async deleteComment($event: MouseEvent) {
    $event.stopPropagation();

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the comment "${this.clampDescription(this.comment()?.content)}"? This action cannot be undone.`,
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
      const comment = this.comment();
      if (!comment) {
        console.error('No comment to delete');
        return;
      }
      console.log('Deleting comment:', comment.id, "MemeId:", comment.MemeId);
      this.commentService.deleteComment(comment.MemeId, comment.id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Deleted!',
            text: `The comment "${this.clampDescription(comment.content)}" has been deleted successfully.`,
            icon: 'success',
            customClass: {
              popup: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-300',
              confirmButton: '!bg-green-600 !text-white'
            }
          }).then(() => {
            this.commentDeleted.emit(comment.id);
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
  clampDescription(text: string | undefined, maxLength: number = 100): string {
    if (!text) return '';
    const a = text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    console.log('Clamped description:', a);
    return a;
  }

  captureClick(event: MouseEvent) {
    event.stopPropagation();
  }

  editComment(event: MouseEvent) {
    event.stopPropagation();
    this.newComment = this.comment()?.content || '';
    this.isEditing = !this.isEditing; // Toggle editing state
    // call the service to edit the meme
    console.log('Comment edited:', this.comment()?.id);
  }

  submitEditedComment(event: Event) {
    event.stopPropagation();
    const trimmedComment = this.newComment.trim();
    if (trimmedComment === '') {
      this.toastr.error('Comment cannot be empty', 'Error');
      return;
    }

    this.commentService.updateComment(this.comment()?.MemeId || '', this.comment()?.id || '', trimmedComment).subscribe({
      next: (updatedComment) => {
        console.log('Comment updated:', updatedComment);
        this.comment.set(updatedComment);
        this.isEditing = false; // Exit editing mode
        this.toastr.success('Comment updated successfully', 'Success');
      },
      error: (error) => {
        console.error('Error updating comment:', error);
        this.toastr.error('Failed to update comment', 'Error');
      }
    });

  }

  voteComment(vote: boolean) {
    const comment = this.comment();
    if (!comment) { return; }
    this.commentService.voteComment(comment.MemeId, comment.id, vote).subscribe({
      next: (updatedComment) => {

        if (vote) {
          comment.upvotesNumber++;
        }
        else {
          comment.downvotesNumber++;
        }
        if (this.liked() === false) {
          comment.downvotesNumber--;
        } else if (this.liked() === true) {
          comment.upvotesNumber--;
        }
        this.liked.set(vote);
        this.comment.set(comment);
      },
      error: (error) => {
        console.error('Error voting comment:', error);
        this.toastr.error('Failed to vote on comment', 'Error');
      }
    });

  }

  handleUpvoteClick() {
    const comment = this.comment();
    if (!comment) { return; }

    if (this.liked() === true) {
      this.unvoteComment();
    } else {
      this.voteComment(true);
    }
  }

  handleDownvoteClick() {
    const comment = this.comment();
    if (!comment) { return; }
    if (this.liked() === false) {
      this.unvoteComment();
    } else {
      this.voteComment(false);
    }
  }

  unvoteComment() {
    const comment = this.comment();
    if (!comment) { return; }

    this.commentService.unvoteComment(comment.MemeId, comment.id).subscribe({
      next: () => {
        if (this.liked() === false) {
          comment.downvotesNumber--;
        } else if (this.liked() === true) {
          comment.upvotesNumber--;
        }
        this.liked.set(undefined);

        this.comment.set(comment);
      },
      error: (error) => {
        console.error('Error unvoting comment:', error);
        this.toastr.error('Failed to unvote comment', 'Error');
      }
    });


  }



  handleCommentSubmit(newComment: string) {
    if (newComment.trim() === '') {
      return; // Do not submit empty comments
    }
    // Here you would typically call a service to submit the comment

    const comment = this.comment();
    if (comment) {
      this.commentService.createComment(comment.MemeId, newComment, comment.id).subscribe({
        next: (createdComment) => {
          console.log('Comment created:', createdComment);
          this.toastr.success('Comment submitted successfully', 'Success');
          this.newComment = ''; // Clear the input field
          this.isEditing = false; // Exit editing mode
        },
        error: (error) => {
          console.error('Error creating comment:', error);
          this.toastr.error('Failed to submit comment', 'Error');
        }
      });
      comment.commentsNumber++; // Increment the comments count
      this.comment.set(comment);
    }

  }

  expandComment(event: MouseEvent) {
    event.stopPropagation();
    const comment = this.comment();
    if (!comment) { return; }
    this.router.navigate(['/memes', comment.MemeId, 'comments', comment.id]);
  }
}
