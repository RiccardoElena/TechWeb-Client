import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './_guards/auth/auth.guard';
import { LogoutComponent } from './logout/logout.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { MemeCloseUpComponent } from './meme-close-up/meme-close-up.component';


export const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
    title: "TechWeb Meme Museum"
  }, {
    path: "login",
    component: LoginComponent,
    title: "Login | TechWeb Meme Museum"
  }, {
    path: "signup",
    component: SignupComponent,
    title: "Sign up | TechWeb Meme Museum"
  }, {
    path: "logout",
    component: LogoutComponent,
    title: "Log out | TechWeb Meme Museum"
  },
  {
    path: "memes/search",
    component: SearchResultsComponent,
    title: "Search results | TechWeb Meme Museum"
  },
  {
    path: "memes/:id",
    component: MemeCloseUpComponent,
    title: "Meme details | TechWeb Meme Museum",
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
    title: "Page not found | TechWeb Meme Museum"
  }
];
