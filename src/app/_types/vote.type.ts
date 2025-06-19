export interface Vote {
  userId: string;
  isUpvote: boolean;
  createdAt: Date;
  updatedAt?: Date;
}