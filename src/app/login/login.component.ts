import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../_services/auth/local-auth.service';
import { RemoteAuthService } from '../_services/auth/remote-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  remoteAuthService = inject(RemoteAuthService);
  authService = inject(AuthService);
  submitted = false;
  loginForm = new FormGroup({
    user: new FormControl('', [Validators.required]),
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(16)])
  })

  handleLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.toastr.error("The data you provided is invalid!", "Oops! Invalid data!");
    } else {
      this.remoteAuthService.login(
        this.loginForm.value.user as string,
        this.loginForm.value.pass as string,
      ).subscribe({
        next: (token) => {
          this.authService.updateToken(token).then(() => {
            setTimeout(() => { this.router.navigateByUrl("/todos") }, 10);
          });
        },
        error: (err) => {
          this.toastr.error("Please, insert a valid username and password", "Oops! Invalid credentials");
        },
        complete: () => {

        }
      })
    }
  }
}
