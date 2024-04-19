import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';
import {httpInterceptor} from 'src/app/core/interceptors/httpInterceptor';
import {APP_ROUTES} from 'src/app/app.routing';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {loadingInterceptor} from 'src/app/core/interceptors/loadingInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([httpInterceptor, loadingInterceptor])),
    provideAnimations(),
    provideRouter(APP_ROUTES),
    importProvidersFrom([MatSnackBarModule])
  ]
};
