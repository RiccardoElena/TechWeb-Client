import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
    const params = new HttpParams()
      .set('sortedBy', sortCriteria.sortedBy)
      .set('sortDirection', sortCriteria.sortDirection)
      .set('page', page)
      .set('limit', limit);

    if (userId) { params.set('userId', userId); }

    if (title && title.trim() !== '') { params.set('title', title); }

    if (tags && tags.length > 0) { params.set('tags', tags.join(',')); }

    return this.http.get<EnrichedMemeList>(`${this.API_URL}${this.BASE_PATH}`, { ...this.httpOptions, params });
  }

  getMemeById(id: number, commentsPage: number = 0, commentsLimit: number = 10) {
    const params = new HttpParams()
      .set('commentsPage', commentsPage)
      .set('commentsLimit', commentsLimit);

    return this.http.get<CommentedMeme>(`${this.API_URL}${this.BASE_PATH}/${id}`, { ...this.httpOptions, params });
  }

  voteMeme(id: number, isUpvote: boolean) {
    return this.http.post<CompletlyEnrichedMeme>(`${this.API_URL}${this.BASE_PATH}/${id}/vote`, { isUpvote }, this.httpOptions);
  }

  unvoteMeme(id: number) {
    return this.http.delete<CompletlyEnrichedMeme>(`${this.API_URL}${this.BASE_PATH}/${id}/vote`, this.httpOptions);
  }

  createMeme(meme: FormData) {
    return this.http.post(`${this.API_URL}${this.BASE_PATH}`, meme);
  }

  updateMeme(id: number, meme: UpdateableMeme) {
    return this.http.put<EnrichedMeme>(`${this.API_URL}${this.BASE_PATH}/${id}`, meme, this.httpOptions);
  }

  deleteMeme(id: number) {
    return this.http.delete(`${this.API_URL}${this.BASE_PATH}/${id}`, this.httpOptions);
  }
}
