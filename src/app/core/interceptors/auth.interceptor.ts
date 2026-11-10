import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../../services/AuthService';
import { Toast } from '../../services/ToastService';
import { API_URL } from '../api';

/** Endpoints que não usam token: login e cadastro de usuário. */
function ehPublica(req: HttpRequest<unknown>): boolean {
  return (
    req.url === `${API_URL}/usuario/login` ||
    (req.method === 'POST' && req.url === `${API_URL}/usuario`)
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const toast = inject(Toast);

  if (!req.url.startsWith(API_URL) || ehPublica(req)) {
    return next(req);
  }

  const token = authService.getToken();
  const requisicao = token ? req.clone({ setHeaders: { Authorization: token } }) : req;

  return next(requisicao).pipe(
    catchError((erro: HttpErrorResponse) => {
      // só reage uma vez: depois do logout o token some e as próximas falhas são ignoradas
      if (erro.status === 401 && authService.getToken()) {
        authService.logout();
        toast.error('Sessão expirada. Faça login novamente.');
        router.navigate(['/login']);
      }
      return throwError(() => erro);
    }),
  );
};
