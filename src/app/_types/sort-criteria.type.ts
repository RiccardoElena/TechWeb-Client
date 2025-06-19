export type SortBy = 'createdAt' | 'upvotesNumber' | 'downvotesNumber' | 'commentsNumber';
export type SortDirection = 'ASC' | 'DESC';

export type SortCriteria = {
  sortedBy: SortBy;
  sortDirection: SortDirection;
};
