import {Injectable} from '@angular/core';
import {BehaviorSubject, flatMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this.loading.asObservable();

  show() {
    this.loading.next(true);
  }

  hide() {
    this.loading.next(false);
  }

  public loadingVacancies: boolean = false;
  public loadingQuestions: boolean = false;
  public loadingApplications: boolean = false;
  public updatingVacancies: boolean = false;
  public loadingQuestionTopics: boolean = false;
  public loadingQuestionTypes: boolean = false;
}
