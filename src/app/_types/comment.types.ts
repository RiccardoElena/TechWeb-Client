import { Vote } from "./vote.type";

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  UserId: string;
  MemeId: string;
  parentId?: string;
  upvotesNumber: number;
  downvotesNumber: number;
  commentsNumber: number;
}

export interface EnrichedComment extends Comment {
  CommentVotes: boolean[];
  userName: string;
}

export interface CommentedComment {
  data: {
    parent: EnrichedComment;
    replies: EnrichedComment[];
  };
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
  };
}

export interface CommentVote extends Vote {
  commentId: string;
}