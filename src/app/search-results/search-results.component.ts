import { Component, inject, output } from '@angular/core';
import { SearchBarComponent, SearchFn } from '../_internalComponents/search-bar/search-bar.component';
import { MemeCardComponent } from "../_internalComponents/meme-card/meme-card.component";
import { EnrichedMeme, EnrichedMemeList } from '../_types/meme.types';
import { ActivatedRoute, Router } from '@angular/router';
import { MemesService } from '../_services/meme/memes.service';
import { AuthService } from '../_services/auth/local-auth.service';
import { RouterLink } from '@angular/router';
import { SortCriteria } from '../_types/sort-criteria.type';
import { SearchQuery } from '../landing/landing.component';


@Component({
  selector: 'app-search-results',
  imports: [SearchBarComponent, MemeCardComponent, MemeCardComponent, RouterLink],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {

  memes: EnrichedMeme[] = [];
  private currentPage = -1;
  private pageSize = 10;
  hasMore = true;

  authService = inject(AuthService);

  user: { userId: string, userName: string } | undefined = undefined;

  private route = inject(ActivatedRoute);

  private memeService = inject(MemesService);

  ngOnInit() {
    console.log(this.authService.authState());

    this.route.queryParams.subscribe(params => {
      this.currentPage = -1; // Reset current page on new search
      this.pageSize = 10; // Reset page size on new search
      this.memes = [];
      this.user = undefined;
      console.log('Route query parameters:', params);
      const tags = params['tags'] ? params['tags'].split(',') : [];
      const searchQuery = params['query'] || '';
      const sortBy = params['sortBy'] || 'createdAt';
      const sortOrder = params['sortOrder'] || 'DESC';
      const userId = params['userId'];
      console.log('Query parameters:', { tags, searchQuery, sortBy, sortOrder, userId });

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
      console.log('Fetched memes:', data);
      this.user = data.user
      this.memes = [...this.memes, ...data.data];
      this.hasMore = data.pagination.hasMore;
      this.currentPage = data.pagination.page;
      this.pageSize = data.pagination.limit;
    });
  }

  onSearch(router: Router, tags: string[], searchQuery: string, sortCriteria: SortCriteria, userId?: string) {
    console.log('Search function called with:', { tags, searchQuery, sortCriteria, userId });
    const queryParams: SearchQuery = {};

    if (tags.length > 0) {
      queryParams['tags'] = tags.join(',');
    }
    if (searchQuery) {
      queryParams['query'] = searchQuery;
    }
    if (sortCriteria) {
      queryParams['sortBy'] = sortCriteria.sortedBy;
      queryParams['sortOrder'] = sortCriteria.sortDirection;
    }
    if (userId) {
      queryParams['userId'] = userId;
    }
    router.navigate(['/memes/search'], {
      queryParams: queryParams
    });
  }

}
