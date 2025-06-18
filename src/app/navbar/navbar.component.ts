import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';
import { AuthService } from '../_services/auth/local-auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

import { BreakpointObserver } from '@angular/cdk/layout';


@Component({
  selector: 'app-navbar',
  standalone: true,
  animations: [
    trigger('openClose', [
      state('closed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('closed <=> open', [
        animate('300ms cubic-bezier(.68,-0.55,.27,1.55)') // bounce effect
      ]),

    ])
  ],
  imports: [RouterLink, RouterLinkActive, DarkModeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  isMobile = false; //determines whether the screen is mobile or not
  isOpen = false; //determines whether the mobile navbar is toggled or not
  isDropdownOpen = false;

  authService = inject(AuthService);
  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(['(max-width: 768px)'])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }
  /**
   * Handles user click on the navbar menu toggle on small screens
   */
  toggle() {
    this.isOpen = !this.isOpen;
  }

  /**
   * Closes the toggled navbar when a user clicks on a link
   */
  handleNavigationClick() {
    this.isOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
