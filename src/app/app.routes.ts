import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { authGuard } from './_guards/auth/auth.guard';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  {
    path: "",
    component: LandingComponent,
    title: "To-do List Angular App"
  }, {
    path: "login",
    component: LoginComponent,
    title: "Login | To-do List Angular App"
  }, {
    path: "signup",
    component: SignupComponent,
    title: "Sign up | To-do List Angular App"
  }, {
    path: "logout",
    component: LogoutComponent,
    title: "Log out | To-do List Angular App"
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
    title: "Page not found | To-do List Angular App"
  }
];
