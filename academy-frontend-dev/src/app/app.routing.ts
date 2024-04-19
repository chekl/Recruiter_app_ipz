import {Routes} from '@angular/router';
import {loggedInGuard} from 'src/app/common/guards/logged-in.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: 'auth',
    loadComponent: () => import('src/app/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'candidate',
    loadChildren: () => import('src/app/candidate/candidate.routing').then(m => m.CANDIDATE_ROUTING)
  },
  {
    path: 'question',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('src/app/question/question.component').then(m => m.QuestionComponent)
  },
  {
    path: 'setting',
    canActivate: [loggedInGuard],
    loadComponent: () => import('src/app/setting/setting.component').then(m => m.SettingComponent)
  },
  {
    path: 'vacancy',
    canActivate: [loggedInGuard],
    loadComponent: () => import('src/app/vacancy/vacancy.component').then(m => m.VacancyComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('src/app/vacancy/components/vacancy-list/vacancy-list.component').then(
            m => m.VacancyListComponent
          )
      },
      {
        path: 'review',
        loadComponent: () =>
          import('src/app/vacancy/components/review-page/review-page.component').then(
            m => m.ReviewPageComponent
          )
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            'src/app/vacancy/components/create-edit-vacancy/create-edit-vacancy.component'
          ).then(m => m.CreateEditVacancyComponent)
      },
      {
        path: 'application/:id',
        loadComponent: () =>
          import('src/app/vacancy/components/vacancy-answer/vacancy-answer.component').then(
            m => m.VacancyAnswerComponent
          )
      },
      {
        path: 'info/:id',
        loadComponent: () =>
          import('src/app/vacancy/info/vacancy-info.component').then(m => m.VacancyInfoComponent)
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import(
            'src/app/vacancy/components/create-edit-vacancy/create-edit-vacancy.component'
          ).then(m => m.CreateEditVacancyComponent)
      }
    ]
  },
  {
    path: 'not-found',
    canActivate: [loggedInGuard],
    loadComponent: () =>
      import('src/app/not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
];
