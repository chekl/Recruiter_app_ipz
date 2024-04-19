import {Routes} from '@angular/router';

export const CANDIDATE_ROUTING: Routes = [
  {
    path: 'thank-you',
    loadComponent: () =>
      import('src/app/candidate/components/thank-you/thank-you.component').then(
        m => m.ThankYouComponent
      )
  },
  {
    path: 'sorry',
    loadComponent: () =>
      import('src/app/candidate/components/sorry/sorry.component').then(m => m.SorryComponent)
  },
  {
    path: ':applicationId',
    loadComponent: () =>
      import('src/app/candidate/components/main/main.component').then(m => m.MainComponent)
  }
];
