import {enableProdMode} from '@angular/core';

import {bootstrapApplication} from '@angular/platform-browser';
import {environment} from 'src/environments/environment';
import {AppComponent} from 'src/app/app.component';
import {appConfig} from 'src/app/app.config';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
