import { Component, inject, output } from '@angular/core';
import { SearchBarComponent } from '../_internalComponents/search-bar/search-bar.component';
import { MemeCardComponent } from "../_internalComponents/meme-card/meme-card.component";
import { EnrichedMeme, EnrichedMemeList } from '../_types/meme.types';
import { ActivatedRoute, Router } from '@angular/router';
import { MemesService } from '../_services/meme/memes.service';
import { AuthService } from '../_services/auth/local-auth.service';
import { AuthState } from '../_types/auth-state.type';
import { SortCriteria } from '../_types/sort-criteria.type';


@Component({
  selector: 'app-search-results',
  imports: [SearchBarComponent, MemeCardComponent, MemeCardComponent],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {

  memes: EnrichedMeme[] = [];
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

      this.fetchMemes(
        tags,
        searchQuery,
        {
          sortedBy: sortBy as SortCriteria['sortedBy'],
          sortDirection: sortOrder as SortCriteria['sortDirection']
        },
        userId
      );

    });
  }

  loadMore() {
    if (!this.hasMore) {
      return;
    }
    this.fetchMemes(
      this.route.snapshot.queryParams['tags'] || '',
      this.route.snapshot.queryParams['query'] || '',
      {
        sortedBy: this.route.snapshot.queryParams['sortBy'] || 'createdAt',
        sortDirection: this.route.snapshot.queryParams['sortOrder'] || 'DESC'
      },
      this.route.snapshot.queryParams['userId'])
  }

  fetchMemes(
    tags: string[],
    searchQuery: string,
    sortCriteria: SortCriteria,
    userId?: string,
  ) {
    console.log(this.currentPage)
    this.memeService.getMemes(
      tags,
      searchQuery,
      sortCriteria,
      userId,
      ++this.currentPage,
      this.pageSize
    ).subscribe((data: EnrichedMemeList) => {
      this.memes = [...this.memes, ...data.data];
      this.memes.forEach(meme => {
        console.log(meme);
      });
      this.hasMore = data.pagination.hasMore;
      this.currentPage = data.pagination.page;
      this.pageSize = data.pagination.limit;
    });

  }

}
