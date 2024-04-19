import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {
  Application,
  ApplicationStatus,
  QuestionWithAnswerServer,
  QuestionWithAnswerSimple
} from 'src/app/common/models/application.model';
import {environment} from 'src/environments/environment';
import {AnswerStatuses, ApplicationStatuses} from 'src/app/common/enums/enums';

@Injectable({
  providedIn: 'root'
})
export class CandidateTestService {
  completedQuestionCount$ = new BehaviorSubject<number>(0);
  private answers$ = new BehaviorSubject<QuestionWithAnswerSimple[]>([]);

  constructor(private http: HttpClient) {}

  getApplicationById(id: string): Observable<Application> {
    return this.http.get<Application>(`${environment.apiUrl}/applications/for-candidate/${id}`);
  }

  setQuestionAnswer(
    answer: string,
    executionTime: number,
    question: QuestionWithAnswerServer
  ): void {
    const {_id, ...restQuestion} = question;
    this.answers$.next([
      ...this.answers$.getValue(),
      {
        ...restQuestion,
        topics: [...(<string[]>restQuestion?.topics?.map(el => el._id))],
        type: restQuestion?.type?._id as string,
        answer: {
          status: AnswerStatuses.ANSWERED,
          executionTime,
          body: answer
        }
      }
    ]);
    this.incrementQuestionCount();
  }

  setApplicationStatus(id: string, status: ApplicationStatus): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/applications/${id}`, {
      status
    });
  }

  postCandidateAnswers(id: string): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/applications/${id}`, {
      questions: [...this.answers$.getValue()],
      status: ApplicationStatuses.COMPLETED,
      completed: Date.now()
    });
  }

  incrementQuestionCount(): void {
    let currentCount = this.completedQuestionCount$.getValue();
    this.completedQuestionCount$.next(++currentCount);
  }
}
