import { Component, inject, output } from '@angular/core';
import { SearchBarComponent, SearchFn } from '../_internalComponents/search-bar/search-bar.component';
import { MemeCardComponent } from "../_internalComponents/meme-card/meme-card.component";
import { EnrichedMeme, EnrichedMemeList } from '../_types/meme.types';
import { ActivatedRoute, Router } from '@angular/router';
import { MemesService } from '../_services/meme/memes.service';
import { AuthService } from '../_services/auth/local-auth.service';
import { RouterLink } from '@angular/router';
import { SortBy, SortCriteria, SortDirection } from '../_types/sort-criteria.type';
import { SearchQuery } from '../landing/landing.component';
import { NavigationService } from '../_services/navigation/navigation.service';


@Component({
  selector: 'app-search-results',
  imports: [SearchBarComponent, MemeCardComponent, MemeCardComponent, RouterLink],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {

  memes: EnrichedMeme[] = [];
  private currentPage = -1;
  private pageSize = 1;
  hasMore = true;
  tags: string[] = [];
  searchQuery = '';
  sortCriteria: `${SortBy},${SortDirection}` = 'createdAt,DESC';

  authService = inject(AuthService);
  navigationService = inject(NavigationService);

  user: { id: string, userName: string } | undefined = undefined;

  private route = inject(ActivatedRoute);

  private memeService = inject(MemesService);

  ngOnInit() {


    this.route.queryParams.subscribe(params => {
      this.navigationService.push(this.route.snapshot.url.join('/'), params);
      this.currentPage = -1;
      this.pageSize = 10;
      this.memes = [];
      this.user = undefined;

      this.tags = params['tags'] ? params['tags'].split(',') : [];
      this.searchQuery = params['query'] || '';
      const sortBy = params['sortBy'] || 'createdAt';
      const sortOrder = params['sortOrder'] || 'DESC';
      this.sortCriteria = `${sortBy},${sortOrder}` as `${SortBy},${SortDirection}`;
      const userId = params['userId'];


      this.fetchMemes(
        this.tags,
        this.searchQuery,
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

    this.memeService.getMemes(
      tags,
      searchQuery,
      sortCriteria,
      userId,
      ++this.currentPage,
      this.pageSize
    ).subscribe((data: EnrichedMemeList) => {

      this.user = data.user

      this.memes = [...this.memes, ...data.data];
      this.hasMore = data.pagination.hasMore;
      this.currentPage = data.pagination.page;
      this.pageSize = data.pagination.limit;
    });
  }

  onMemeDelete(memeId: string) {

    this.memes = this.memes.filter(meme => meme.id !== memeId);
  }

  onSearch(router: Router, tags: string[], searchQuery: string, sortCriteria: SortCriteria, userId?: string) {

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
