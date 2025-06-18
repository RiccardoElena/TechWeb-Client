interface Meme {
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

interface UpdateableMeme {
  title?: string;
  description?: string;
  tags?: string[];
}

interface EnrichedMeme extends Meme {
  MemeVotes: boolean[];
}

interface EnrichedMemeList {
  data: EnrichedMeme[],
  pagination: {
    page: number,
    limit: number,
    hasMore: boolean
  }
}

interface CommentedMeme extends EnrichedMeme {
  comments: EnrichedComment[];
  commentsPagination: {
    page: number;
    limit: number;
    totalCount: number;
  };
}

interface MemeVote extends Vote {
  memeId: string;
}

interface CompletlyEnrichedMeme extends Meme {
  MemeVotes: MemeVote[];
}
