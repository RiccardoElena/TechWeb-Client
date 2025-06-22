import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {


  private navigationStack: { url: string, queryParams: Record<string, string> }[] = [];
  router = inject(Router);

  constructor() { }


  push(url: string, queryParams: Record<string, string> = {}): void {
    this.navigationStack.push({ url, queryParams });
  }

  pop(): { url: string, queryParams: Record<string, string> } | undefined {
    return this.navigationStack.pop();
  }

  navigateAndPop(): void {
    const lastNavigation = this.pop();
    if (lastNavigation) {
      this.router.navigate([lastNavigation.url], { queryParams: lastNavigation.queryParams });
    } else {
      this.router.navigate(['/']);
    }

  }
}
