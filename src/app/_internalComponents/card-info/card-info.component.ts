import { Component, inject, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-card-info',
  imports: [FontAwesomeModule, FormsModule],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.scss'
})
export class CardInfoComponent {

  toastr = inject(ToastrService);

  isCommenting = false;
  commentText = '';
  icons = {
    comment: faComment,
    upvote: faThumbsUp,
    downvote: faThumbsDown
  };
  tags = input<string[]>([]);
  vote = input<boolean | undefined>(undefined);
  upvotesNumber = input<number>(0);
  downvotesNumber = input<number>(0);
  commentsNumber = input<number>(0);

  upvoteClick = output<void>();
  downvoteClick = output<void>();

  commentTextSubmit = output<string>();


  commentClicked(event: Event) {

    event.stopPropagation();
    this.isCommenting = !this.isCommenting;
  }
  downvoteClicked(event: Event) {
    event.stopPropagation();
    this.downvoteClick.emit();
  }

  upvoteClicked(event: Event) {
    event.stopPropagation();

    this.upvoteClick.emit();
  }

  submitComment(event: Event) {
    event.stopPropagation();
    if (this.commentText.trim()) {
      this.commentTextSubmit.emit(this.commentText.trim());
      this.commentText = '';
      this.isCommenting = false;
    } else {
      this.toastr.error('Comment cannot be empty', 'Error');
    }
  }

  captureCardInfoClick(event: Event) {
    event.stopPropagation();

  }
}
