import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {StorageService} from '../services/storage.service';

export const loggedInGuard = () => {
  const router = inject(Router);
  const service = inject(StorageService);
  return !service.isLoggedIn() ? router.navigate(['/auth']) : true;
};
