import { Component, effect, inject, input } from '@angular/core';
import { EnrichedMeme } from '../../_types/meme.types';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../_services/auth/local-auth.service';
import { CardInfoComponent } from "../card-info/card-info.component";
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-meme-card',
  imports: [FontAwesomeModule, RouterLink, FormsModule, CardInfoComponent],
  templateUrl: './meme-card.component.html',
  styleUrl: './meme-card.component.scss'
})

export class MemeCardComponent {

  meme: EnrichedMeme;
  constructor() {
    effect(() => {
      this.meme = this.inputMeme();
    });
  }
  icons = {
    delete: faTrash,
    edit: faPencil
  };

  router = inject(Router);
  authService = inject(AuthService);
  // dialogService = inject(DialogService)

  inputMeme = input<EnrichedMeme>({
    id: '1234',
    title: 'Great Meme',
    fileName: 'great-meme.jpg',
    filePath: '/assets/placeholder.jpeg',
    description: 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ['funny', 'meme', 'trending', 'popular', 'new', 'cool', 'awesome'],
    userId: 'a6633dba-8e0a-4d21-9b00-4e01cc66269b',
    upvotesNumber: 10,
    downvotesNumber: 2,
    commentsNumber: 5,
    MemeVotes: [],
    userName: 'John Doe'
  });

  async deleteMeme($event: MouseEvent) {
    $event.stopPropagation();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the meme "${this.meme.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      customClass: {
        popup: '!bg-zinc-100 dark:!bg-zinc-800 !text-zinc-800 dark:!text-zinc-300',
        icon: '!text-red-600 !border-red-600 dark:!text-red-400 dark:!border-red-400',
        confirmButton: '!bg-red-600 !text-white',
        cancelButton: '!bg-gray-300 !text-gray-800'
      }
    });

    console.log(result);

    // this.dialogService.confirm(`Delete ${this.meme.title}?`).subscribe((confirmed) => {
    //   if (confirmed) {
    //     console.log('Meme deleted:', this.meme.id);
    //   }
    // });
    // call the service to delete the meme

  }

  editMeme($event: MouseEvent) {
    $event.stopPropagation();
    // call the service to edit the meme
    console.log('Meme edited:', this.meme.id);
  }

  preventDefaultLink(event: MouseEvent) {
    event.stopPropagation();
  }


  voteMeme(vote: boolean) {
    // call the service to vote the meme
    if (vote) {
      this.meme.upvotesNumber++;
    }
    else {
      this.meme.downvotesNumber++;
    }
    if (this.meme.MemeVotes[0] === false) {
      this.meme.downvotesNumber--;
    } else if (this.meme.MemeVotes[0] === true) {
      this.meme.upvotesNumber--;
    }
    this.meme.MemeVotes[0] = vote;
  }

  handleUpvoteClick() {

    if (this.meme.MemeVotes[0]) {
      this.unvoteMeme();
    } else {
      this.voteMeme(true);
    }
  }

  handleDownvoteClick() {

    if (this.meme.MemeVotes[0] === false) {
      this.unvoteMeme();
    } else {
      this.voteMeme(false);
    }
  }

  unvoteMeme() {

    // call the service to unvote the meme
    if (this.meme.MemeVotes[0] === false) {
      this.meme.downvotesNumber--;
    } else if (this.meme.MemeVotes[0] === true) {
      this.meme.upvotesNumber--;
    }
    this.meme.MemeVotes = [];
  }



  handleCommentSubmit(comment: string) {

    if (comment.trim() === '') {
      return; // Do not submit empty comments
    }
    // Here you would typically call a service to submit the comment
    console.log('Comment submitted:', comment);
    this.meme.commentsNumber++; // Increment the comments count
    // TODO: send the comment to the server
  }

  expandCard() {
    this.router.navigate(['/memes', this.meme.id])
  }

}
