import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {

  constructor(private router: Router) { }

  tags: string[] = [];
  inputValue = '';
  advancedMode = false;
  selectedOrder = 'createdAt,DESC';
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
    console.log('Searching memes with:', this.tags, this.searchQuery, this.selectedOrder);
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
  }
}
