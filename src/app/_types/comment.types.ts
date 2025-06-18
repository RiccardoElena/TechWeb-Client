interface Comment {
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

interface EnrichedComment extends Comment {
  CommentVotes: boolean[];
  userName: string;
}

interface CommentedComment {
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

interface CommentVote extends Vote {
  commentId: string;
}