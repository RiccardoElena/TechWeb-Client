import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RemoteAuthService {

  private readonly API_URL = 'http://localhost:3000';
  private readonly BASE_PATH = '/auth';
  private readonly httpOptions = {
    headers: { 'Content-Type': 'application/json' },
  };
  constructor(private readonly http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post<string>(`${this.API_URL}${this.BASE_PATH}/login`, { username, password }, this.httpOptions);
  }

  signup(username: string, password: string) {
    return this.http.post<string>(`${this.API_URL}${this.BASE_PATH}/signup`, { username, password }, this.httpOptions);
  }
}
