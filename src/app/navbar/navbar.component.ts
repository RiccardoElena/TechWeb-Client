import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';
import { AuthService } from '../_services/auth/local-auth.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,

} from '@angular/animations';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MemesService } from '../_services/meme/memes.service';
import { NavigationService } from '../_services/navigation/navigation.service';
import { Location } from '@angular/common';

type NavigationEvent = "memeOfTheDay" | "home" | "search" | "profile" | "login" | "logout";

@Component({
  selector: 'app-navbar',
  standalone: true,
  animations: [
    trigger('openClose', [
      state('closed', style({ height: '0', opacity: 0, overflow: 'hidden' })),
      state('open', style({ height: '*', opacity: 1, overflow: 'hidden' })),
      transition('closed <=> open', [
        animate('300ms cubic-bezier(.68,-0.55,.27,1.55)')
      ]),

    ])
  ],
  imports: [RouterLink, RouterLinkActive, DarkModeToggleComponent, FontAwesomeModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  router = inject(Router)
  isMobile = false; //determines whether the screen is mobile or not
  isOpen = false; //determines whether the mobile navbar is toggled or not
  isDropdownOpen = false;
  activeRoute = inject(ActivatedRoute)
  authService = inject(AuthService);
  memeService = inject(MemesService);
  memeOfTheDayId = '';
  navigation = inject(NavigationService)
  location = inject(Location)

  icons = {
    logout: faRightFromBracket
  };

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(['(max-width: 1024px)'])
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
  async handleNavigationClick(navigationEvent?: NavigationEvent, event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isOpen = false;
    switch (navigationEvent) {
      case "memeOfTheDay":
        this.memeService.getMemeOfTheDayId().subscribe({
          next: (memeId) => {

            this.memeOfTheDayId = memeId;

            this.router.navigate(['/memes', memeId], { replaceUrl: true });
          },
          error: (error) => {

          }
        });
        break;
      case "logout":
        const response = await Swal.fire({
          title: 'Are you sure?',
          text: "You will be logged out and redirected to the homepage.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, log out',
          cancelButtonText: 'No, stay logged in',
          customClass: {
            popup: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-300',
            icon: '!text-red-600 !border-red-600 dark:!text-red-400 dark:!border-red-400',
            confirmButton: '!bg-red-600 !text-white',
            cancelButton: '!bg-gray-300 !text-gray-800'
          }
        });
        if (response.isConfirmed) {
          this.router.navigateByUrl('/logout');
          return;
        }
        break;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
