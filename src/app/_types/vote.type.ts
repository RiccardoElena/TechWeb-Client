

export interface SimpleVote {
  isUpvote: boolean;
}

export interface Vote extends SimpleVote {
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}