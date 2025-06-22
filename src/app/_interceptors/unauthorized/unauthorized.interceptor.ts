import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../_services/auth/local-auth.service';
import { Toast, ToastrService } from 'ngx-toastr';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (router.url === '/login' || router.url === '/signup') {

        return throwError(() => error);
      }
      if (error.status === 401) {
        const token = authService.getToken();
        if (token) {

          toastr.error('Session ended. Please log in again.', 'Authentication Error');
        } else {

          toastr.error('You are not authenticated. Please log in.', 'Authentication Error');
        }

        router.navigate(['/login']);
      }
      return throwError(() => error);
    })

  );
};
