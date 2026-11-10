import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/AuthService';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(Auth);
  const router = inject(Router);

  return authService.isLoggedIn() ? router.createUrlTree(['/tasks']) : true;
};
