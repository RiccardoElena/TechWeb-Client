import { Component, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommentedMeme } from '../_types/meme.types';
import { CardInfoComponent } from "../_internalComponents/card-info/card-info.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommentCardComponent } from '../_internalComponents/comment-card/comment-card.component';
import { Location } from '@angular/common';
import { faClose } from '@fortawesome/free-solid-svg-icons';

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
    close: faClose
  };

  meme: CommentedMeme = {
    id: '1234',
    title: 'Great Meme',
    fileName: 'great-meme.jpg',
    filePath: '/assets/placeholder.jpeg',
    description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['funny', 'meme'],
    userId: 'user-123',
    upvotesNumber: 10,
    downvotesNumber: 2,
    commentsNumber: 5,
    MemeVotes: [],
    userName: 'John Doe',
    comments: [{
      id: 'comment-1',
      UserId: 'user-123',
      userName: 'John Doe',
      content: 'This is a great meme! lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      createdAt: new Date(),
      updatedAt: new Date(),
      MemeId: '1234',
      upvotesNumber: 5,
      downvotesNumber: 1,
      commentsNumber: 0,
      CommentVotes: []
    }, {
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
    }, {
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
    }],
    commentsPagination: {
      page: 0,
      limit: 10,
      totalCount: 15
    }
  };

  moreComments = [{
    id: 'comment-1',
    UserId: 'user-123',
    userName: 'John Doe',
    content: 'This is a great meme! lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: new Date(),
    updatedAt: new Date(),
    MemeId: '1234',
    upvotesNumber: 5,
    downvotesNumber: 1,
    commentsNumber: 0,
    CommentVotes: []
  }, {
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
  }, {
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
  }];

  comments = signal(this.meme.comments);
  currentPage = signal(this.meme.commentsPagination.page);
  limit = signal(this.meme.commentsPagination.limit);
  totalCount = signal(this.meme.commentsPagination.totalCount);
  hasMoreComments = computed(() => this.comments().length < this.totalCount());
  locationService = inject(Location);

  showFullDcp = false;

  goBack() {
    this.locationService.back();
  }

  toggleShowFullDcp() {
    this.showFullDcp = !this.showFullDcp;
  }

  loadMore() {
    this.currentPage.set(this.currentPage() + 1);
    // Here you would typically call a service to fetch more comments
    console.log('Loading more comments for page:', this.currentPage());
    // For demonstration, we will just append more comments to the existing ones
    this.comments.update(currentComments => [
      ...currentComments,
      ...this.moreComments
    ]);
  }

  ngOnInit() {
    const memeId = this.route.snapshot.paramMap.get('id');
    // TODO: Fetch the meme details using the memeId
    console.log('Meme ID:', memeId);

    this.titleService.setTitle(`${this.meme.title}| TechWeb Meme Museum`);
  }

  toggleShowMore() {

    this.showFullDcp = !this.showFullDcp;
  }

  voteMeme(vote: boolean) {
    // call the service to vote the meme
    if (vote) {
      this.meme.upvotesNumber++;
    }
    else {
      this.meme.downvotesNumber++;
    }
    if (this.meme.MemeVotes[0] === false) {
      this.meme.downvotesNumber--;
    } else if (this.meme.MemeVotes[0] === true) {
      this.meme.upvotesNumber--;
    }
    this.meme.MemeVotes[0] = vote;
  }

  handleUpvoteClick() {

    if (this.meme.MemeVotes[0]) {
      this.unvoteMeme();
    } else {
      this.voteMeme(true);
    }
  }

  handleDownvoteClick() {

    if (this.meme.MemeVotes[0] === false) {
      this.unvoteMeme();
    } else {
      this.voteMeme(false);
    }
  }

  unvoteMeme() {

    // call the service to unvote the meme
    if (this.meme.MemeVotes[0] === false) {
      this.meme.downvotesNumber--;
    } else if (this.meme.MemeVotes[0] === true) {
      this.meme.upvotesNumber--;
    }
    this.meme.MemeVotes = [];
  }



  handleCommentSubmit(comment: string) {

    if (comment.trim() === '') {
      return; // Do not submit empty comments
    }
    // Here you would typically call a service to submit the comment
    console.log('Comment submitted:', comment);
    this.meme.commentsNumber++; // Increment the comments count
    // TODO: send the comment to the server
  }
}
