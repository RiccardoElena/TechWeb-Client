import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { RemoteAuthService } from '../_services/auth/remote-auth.service';
import { AuthService } from '../_services/auth/local-auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  remoteAuthService = inject(RemoteAuthService);
  location = inject(Location);
  authService = inject(AuthService);
  submitted = false;
  signupForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)])
  })

  handleSignup() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      this.remoteAuthService.signup(
        this.signupForm.value.user as string,
        this.signupForm.value.pass as string,
      ).subscribe({
        next: (token) => {
          this.toastr.success("You have successfully signed up", "Welcome!");
          this.authService.updateToken(token).then(() => {
            setTimeout(() => { this.location.back() }, 10);
          });
        },
        error: (err) => {
          if (err.status === 400) {
            this.toastr.error("The password you selected was too weak", "Oops! Could not create a new user");
            return;
          }
          if (err.status === 409) {
            this.toastr.error("The username you selected was already taken", "Oops! Could not create a new user");
            return;
          }
          this.toastr.error("An unexpected error occurred", "Oops! Could not create a new user");
        },
        complete: () => {
          this.router.navigateByUrl("/");
        }
      })
    }
  }
}
