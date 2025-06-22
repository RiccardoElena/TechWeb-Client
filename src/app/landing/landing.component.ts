import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchBarComponent } from '../_internalComponents/search-bar/search-bar.component';
import { SortCriteria } from '../_types/sort-criteria.type';

export interface SearchQuery {
  tags?: string;
  query?: string;
  sortBy?: string;
  sortOrder?: string;
  userId?: string;
}

@Component({
  selector: 'app-landing',
  imports: [FormsModule, SearchBarComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  search(router: Router, tags: string[], searchQuery: string, sortCriteria: SortCriteria, userId?: string) {



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
