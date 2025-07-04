import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync, } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './_interceptors/auth/auth.interceptor';
import { unauthorizedInterceptor } from './_interceptors/unauthorized/unauthorized.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideToastr({
      progressBar: true,
      newestOnTop: true,
    }),
    provideHttpClient(
      withFetch(), //use the Fetch API instead of XMLHttpRequests
      withInterceptors([authInterceptor, unauthorizedInterceptor])
    ),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }))]
};
