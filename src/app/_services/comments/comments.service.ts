import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnrichedComment } from '../../_types/comment.types';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly API_URL = 'http://localhost:3000';
  private readonly BASE_PATH = '/memes';
  private readonly COMMENTS_PATH = '/comments';
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private readonly http: HttpClient) { }

  getReplies(memeId: string, commentId: string, page: number = 0, limit: number = 10) {
    const url = `${this.API_URL}${this.BASE_PATH}/${memeId}${this.COMMENTS_PATH}/${commentId}/replies`;
    const params = { page: page.toString(), limit: limit.toString() };
    return this.http.get(url, { ...this.httpOptions, params });
  }

  createComment(memeId: string, content: string, parentId?: string) {
    const url = `${this.API_URL}${this.BASE_PATH}/${memeId}${this.COMMENTS_PATH}`;
    const body = { content, parentId };
    return this.http.post<EnrichedComment>(url, body, this.httpOptions);
  }

  updateComment(memeId: string, commentId: string, content: string) {
    const url = `${this.API_URL}${this.BASE_PATH}/${memeId}${this.COMMENTS_PATH}/${commentId}`;
    const body = { content };
    return this.http.put<EnrichedComment>(url, body, this.httpOptions);
  }
  deleteComment(memeId: string, commentId: string) {
    const url = `${this.API_URL}${this.BASE_PATH}/${memeId}${this.COMMENTS_PATH}/${commentId}`;
    return this.http.delete(url, this.httpOptions);
  }
  voteComment(memeId: string, commentId: string, isUpvote: boolean) {
    const url = `${this.API_URL}${this.BASE_PATH}/${memeId}${this.COMMENTS_PATH}/${commentId}/vote`;
    const body = { isUpvote };
    return this.http.put(url, body, this.httpOptions);
  }
  unvoteComment(memeId: string, commentId: string) {
    const url = `${this.API_URL}${this.BASE_PATH}/${memeId}${this.COMMENTS_PATH}/${commentId}/vote`;
    return this.http.delete(url, this.httpOptions);
  }
}
