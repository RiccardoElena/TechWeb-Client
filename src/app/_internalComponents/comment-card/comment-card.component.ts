import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnrichedComment } from '../../_types/comment.types';
import { CardInfoComponent } from '../card-info/card-info.component';

@Component({
  selector: 'app-comment-card',
  imports: [RouterLink, CardInfoComponent],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})

export class CommentCardComponent {
  comment = input<EnrichedComment>({
    id: 'comment-1',
    UserId: 'user-123',
    userName: 'John Doe',
    content: 'This is a great meme!',
    createdAt: new Date(),
    updatedAt: new Date(),
    MemeId: '1234',
    upvotesNumber: 5,
    downvotesNumber: 1,
    commentsNumber: 0,
    CommentVotes: []
  });

  voteComment(vote: boolean) {
    // call the service to vote the comment
    if (vote) {
      this.comment().upvotesNumber++;
    }
    else {
      this.comment().downvotesNumber++;
    }
    if (this.comment().CommentVotes[0] === false) {
      this.comment().downvotesNumber--;
    } else if (this.comment().CommentVotes[0] === true) {
      this.comment().upvotesNumber--;
    }
    this.comment().CommentVotes[0] = vote;
  }

  handleUpvoteClick() {

    if (this.comment().CommentVotes[0]) {
      this.unvoteComment();
    } else {
      this.voteComment(true);
    }
  }

  handleDownvoteClick() {

    if (this.comment().CommentVotes[0] === false) {
      this.unvoteComment();
    } else {
      this.voteComment(false);
    }
  }

  unvoteComment() {

    // call the service to unvote the comment
    if (this.comment().CommentVotes[0] === false) {
      this.comment().downvotesNumber--;
    } else if (this.comment().CommentVotes[0] === true) {
      this.comment().upvotesNumber--;
    }
    this.comment().CommentVotes = [];
  }



  handleCommentSubmit(comment: string) {

    if (comment.trim() === '') {
      return; // Do not submit empty comments
    }
    // Here you would typically call a service to submit the comment
    console.log('Comment submitted:', comment);
    this.comment().commentsNumber++; // Increment the comments count
    // TODO: send the comment to the server
  }


}
