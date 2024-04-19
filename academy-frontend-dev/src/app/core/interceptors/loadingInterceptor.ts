import {inject} from '@angular/core';
import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {finalize} from 'rxjs/operators';
import {LoadingService} from 'src/app/common/services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  let totalRequests = 0;
  const loadingService = inject(LoadingService);

  totalRequests++;
  loadingService.show();

  return next(request).pipe(
    finalize(() => {
      totalRequests--;
      if (totalRequests === 0) {
        loadingService.hide();
      }
    })
  );
};
