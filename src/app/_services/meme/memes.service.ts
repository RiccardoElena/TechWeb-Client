import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SortCriteria } from '../../_types/sort-criteria.type';
import { CommentedMeme, CompletlyEnrichedMeme, EnrichedMeme, EnrichedMemeList, UpdateableMeme } from '../../_types/meme.types';

@Injectable({
  providedIn: 'root'
})
export class MemesService {

  private readonly API_URL = 'http://localhost:3000';
  private readonly BASE_PATH = '/memes';
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private readonly http: HttpClient) { }

  getMemes(
    tags: string[] = [],
    title: string = '',
    sortCriteria: SortCriteria = { sortedBy: 'createdAt', sortDirection: 'DESC' },
    userId: string | null = null,
    page: number = 0,
    limit: number = 10
  ) {
    let params = new HttpParams()
      .set('sortedBy', sortCriteria.sortedBy)
      .set('sortDirection', sortCriteria.sortDirection)
      .set('page', page)
      .set('limit', limit);

    console.log(limit)

    if (userId) { params = params.set('userId', userId); }

    if (title && title.trim() !== '') { params = params.set('title', title); }

    if (tags && tags.length > 0) { params = params.set('tags', tags.join(',')); }

    return this.http.get<EnrichedMemeList>(`${this.API_URL}${this.BASE_PATH}`, { ...this.httpOptions, params });
  }

  getMemeById(id: string, commentsPage: number = 0, commentsLimit: number = 10) {
    const params = new HttpParams()
      .set('commentsPage', commentsPage)
      .set('commentsLimit', commentsLimit);

    return this.http.get<CommentedMeme>(`${this.API_URL}${this.BASE_PATH}/${id}`, { ...this.httpOptions, params });
  }

  getMemeOfTheDayId() {
    return this.http.get<string>(`${this.API_URL}${this.BASE_PATH}/meme-of-the-day/id`, this.httpOptions);
  }

  voteMeme(id: string, isUpvote: boolean) {
    return this.http.put<CompletlyEnrichedMeme>(`${this.API_URL}${this.BASE_PATH}/${id}/vote`, { isUpvote }, this.httpOptions);
  }

  unvoteMeme(id: string) {
    return this.http.delete<CompletlyEnrichedMeme>(`${this.API_URL}${this.BASE_PATH}/${id}/vote`, this.httpOptions);
  }

  createMeme(meme: FormData) {
    return this.http.post(`${this.API_URL}${this.BASE_PATH}`, meme);
  }

  updateMeme(id: string, meme: UpdateableMeme) {
    return this.http.put<EnrichedMeme>(`${this.API_URL}${this.BASE_PATH}/${id}`, meme, this.httpOptions);
  }

  deleteMeme(id: string) {
    return this.http.delete(`${this.API_URL}${this.BASE_PATH}/${id}`, this.httpOptions);
  }
}
