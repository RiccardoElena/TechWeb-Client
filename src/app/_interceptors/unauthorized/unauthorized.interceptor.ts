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
      if (error.status === 401) {
        const token = authService.getToken();
        if (token) {
          // Mostrare un messaggio di errore all'utente
          toastr.error('Sessione scaduta. Effettua nuovamente il login.', 'Errore di Autenticazione');
        } else {
          // Se non c'è un token, significa che l'utente non è autenticato
          toastr.error('Non sei autenticato. Effettua il login.', 'Errore di Autenticazione');
        }
        // 2. Redirect alla pagina di login
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })

  );
};
