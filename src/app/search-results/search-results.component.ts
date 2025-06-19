import { Component, inject, output } from '@angular/core';
import { SearchBarComponent } from '../_internalComponents/search-bar/search-bar.component';
import { MemeCardComponent } from "../_internalComponents/meme-card/meme-card.component";
import { EnrichedMeme } from '../_types/meme.types';
import { ActivatedRoute, Router } from '@angular/router';
import { MemesService } from '../_services/meme/memes.service';
import { AuthService } from '../_services/auth/local-auth.service';
import { AuthState } from '../_types/auth-state.type';


@Component({
  selector: 'app-search-results',
  imports: [SearchBarComponent, MemeCardComponent, MemeCardComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  memes: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  private currentPage = -1;
  private pageSize = 10;
  hasMore = true;

  authService = inject(AuthService);

  user: AuthState | null = this.authService.authState();

  private route = inject(ActivatedRoute);

  private memeService = inject(MemesService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tags = params['tags'] ? params['tags'].split(',') : [];
      const searchQuery = params['query'] || '';
      const sortBy = params['sortBy'] || 'createdAt';
      const sortOrder = params['sortOrder'] || 'DESC';
      const userId = params['userId'];
      console.log('Query parameters:', { tags, searchQuery, sortBy, sortOrder, userId });
      if (!userId) this.user = null;
      else if (userId !== this.authService.getUserId()) {
        this.user = { userId: userId, user: 'Jhon Doe', token: "1234", isAuthenticated: false }; // TODO: Fetch user name from user service
      } else {
        this.user = this.authService.authState();
      }

      console.log('Search parameters:', { tags, searchQuery, sortBy, sortOrder, userId });

    });
  }

  loadMore() {
    if (!this.hasMore) {
      return;
    }
    this.fetchMemes(
      this.route.snapshot.queryParams['tags'] || '',
      this.route.snapshot.queryParams['query'] || '',
      this.route.snapshot.queryParams['sortBy'] || 'createdAt',
      this.route.snapshot.queryParams['sortOrder'] || 'DESC',
      this.route.snapshot.queryParams['userId'])
  }

  fetchMemes(
    tags: string,
    searchQuery: string,
    sortBy: string,
    sortOrder: string,
    userId?: string,
  ) {
    // TODO add service call to fetch memes
    console.log('Fetching memes with parameters:', {
      tags,
      searchQuery,
      sortBy,
      sortOrder,
      userId,
      pageSize: this.pageSize,
      page: this.currentPage + 1
    });
    this.currentPage++;
    if (this.currentPage > 5) {
      this.hasMore = false;
    }
    this.memes.push(...Array.from({ length: this.pageSize }, (_, i) => i + 1 + this.currentPage * this.pageSize));
  }

}
