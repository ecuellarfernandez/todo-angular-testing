import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  
  const token = localStorage.getItem('jwt');
  if (token) {
    return true;
  }
  
  // Redirect to the login page
  return router.parseUrl('/login');
};