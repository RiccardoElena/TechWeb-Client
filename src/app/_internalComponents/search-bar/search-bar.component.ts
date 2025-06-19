import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SortCriteria, SortBy, SortDirection } from '../../_types/sort-criteria.type';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose, faFilter } from '@fortawesome/free-solid-svg-icons';


type SearchFn = (router: Router, tags: string[], searchQuery: string, sortCriteria: SortCriteria, userId?: string) => void;

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, FontAwesomeModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  router = inject(Router);
  icons = {
    close: faClose,
    filter: faFilter
  };
  onSearch = input<SearchFn>();
  extended = input<boolean>(false);
  tags: string[] = [];
  inputValue = '';
  advancedMode = false;
  selectedOrder: `${SortBy},${SortDirection}` = 'createdAt,DESC';
  searchQuery = '';

  handleKey(event: KeyboardEvent) {
    const key = event.key;
    if (key === 'Enter' || key === ',' || key === ' ') {
      event.preventDefault();
      const value = this.inputValue.trim();
      if (value && !this.tags.includes(value)) {
        this.tags.push(value);
      }
      this.inputValue = '';
    }
  }

  searchMemes() {
    const [sortBy, sortDirection] = this.selectedOrder.split(',') as [SortBy, SortDirection];

    this.onSearch()?.(
      this.router,
      this.tags,
      this.searchQuery,
      {
        sortedBy: sortBy,
        sortDirection: sortDirection
      }
    );
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }
}
