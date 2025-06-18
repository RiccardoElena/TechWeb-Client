import { Component } from '@angular/core';

@Component({
  selector: 'dark-mode-toggle',
  standalone: true,
  imports: [],
  templateUrl: './dark-mode-toggle.component.html',
  styleUrl: './dark-mode-toggle.component.scss'
})
export class DarkModeToggleComponent {

  ngOnInit(){
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon') as HTMLElement;
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon') as HTMLElement;
    // Change the icons inside the button based on previous settings
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      themeToggleLightIcon.classList.remove('hidden');
      document.documentElement.classList.add('dark');
    } else {
      themeToggleDarkIcon.classList.remove('hidden');
    }
  }

  toggle() {
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon') as HTMLElement;
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon') as HTMLElement;
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }

    // if NOT set via local storage previously
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
  }
}
