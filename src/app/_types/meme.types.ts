import { EnrichedComment } from './comment.types';
import { SimpleVote, Vote } from './vote.type';


export interface Meme {
  id: string;
  title: string;
  fileName: string;
  filePath: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
  tags?: string[];
  userId: string;
  upvotesNumber: number;
  downvotesNumber: number;
  commentsNumber: number;
}

export interface UpdateableMeme {
  title?: string;
  description?: string;
  tags?: string[];
}

export interface EnrichedMeme extends Meme {
  MemeVotes: SimpleVote[];
  User: {
    id: string;
    userName: string;
  }
}

export interface EnrichedMemeList {
  data: EnrichedMeme[],
  pagination: {
    page: number,
    limit: number,
    hasMore: boolean
  }
}

export interface CommentedMeme extends EnrichedMeme {
  comments: EnrichedComment[];

  commentsPagination: {
    page: number;
    limit: number;
    totalCount: number;
  };
}

export interface MemeVote extends Vote {
  memeId: string;
}

export interface CompletlyEnrichedMeme extends Meme {
  MemeVotes: MemeVote[];
}
