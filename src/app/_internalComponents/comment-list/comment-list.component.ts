import { Component, input, output } from '@angular/core';
import { CommentCardComponent } from '../comment-card/comment-card.component';
import { EnrichedComment } from '../../_types/comment.types';

@Component({
  selector: 'app-comment-list',
  imports: [CommentCardComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.scss'
})
export class CommentListComponent {

  comments = input<EnrichedComment[]>([]);
  totalNumberOfComments = input<number>(0);
  commentDeleted = output<string>();
  loadMoreComments = output<void>();

  constructor() {
    console.log('CommentListComponent initialized with comments:', this.comments());
  }

  deleteComment(commentId: string) {
    console.log('Deleting comment with ID:', commentId);
    this.commentDeleted.emit(commentId);
  }

  loadMore() {
    console.log('Loading more comments...');
    this.loadMoreComments.emit();
  }


}
