import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {catchError, of, retry, switchMap, throwError} from 'rxjs';

import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse as CustomHttpErrorResponse} from 'src/app/core/interceptors/models/interceptor.interface';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {CustomError} from 'src/app/core/interceptors/models/customErrors.enum';
import {AuthService} from 'src/app/common/services/auth.service';
import {StorageService} from 'src/app/common/services/storage.service';

export const httpInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const router: Router = inject(Router);
  const snackBarService = inject(SnackbarService);
  const storageService = inject(StorageService);
  const authService = inject(AuthService);

  const isRefreshing = false;

  request = request.clone({
    withCredentials: true
  });

  function getServices(): [Router, SnackbarService] {
    return [router, snackBarService];
  }

  return next(request).pipe(
    retry(1),
    catchError((error: HttpErrorResponse) => {
      const errorResponse: CustomHttpErrorResponse = error.error;
      switch (errorResponse.http_code) {
        case 400:
          handleBadRequest(errorResponse, ...getServices());
          break;
        case 401:
          handleUnauthorizedRequest(isRefreshing, ...getServices(), authService, storageService);
          break;
        case 403:
          handleForbiddenRequest(...getServices());
          break;
        case 404:
          handleFileNotFoundRequest(getServices()[1]);
          break;
        default:
          return throwError(() => error);
      }
      return of();
    })
  );
};

function handleBadRequest(
  error: CustomHttpErrorResponse,
  router: Router,
  snackBarService: SnackbarService
): void {
  switch (error.status) {
    case CustomError.ApplicationExists:
      snackBarService.showErrorSnackBar(error.error);
      break;

    case CustomError.VacancyClosed:
    case CustomError.ApplicationCompleted:
      router.navigate([`candidate/sorry`]);
      break;

    default:
      snackBarService.showErrorSnackBar('Bad request');
      break;
  }
}

function handleUnauthorizedRequest(
  isRefreshing: boolean,
  router: Router,
  snackBarService: SnackbarService,
  authService: AuthService,
  storageService: StorageService
): void {
  if (!isRefreshing) {
    isRefreshing = true;

    if (storageService.isLoggedIn()) {
      isRefreshing = false;
      authService.refreshToken().pipe(
        catchError(error => {
          isRefreshing = false;

          if (error.status == '403') {
            snackBarService.showErrorSnackBar('Unauthorized access');
            authService.logout().subscribe({
              next: res => {
                storageService.clean();
              },
              error: err => {}
            });
            router.navigate(['auth']);
          }

          return throwError(() => error);
        })
      );
    }
  }
}

function handleForbiddenRequest(router: Router, snackBarService: SnackbarService): void {
  snackBarService.showErrorSnackBar('Forbidden');
  router.navigate(['auth']);
}

function handleFileNotFoundRequest(snackBarService: SnackbarService): void {
  snackBarService.showErrorSnackBar('Not found');
}
