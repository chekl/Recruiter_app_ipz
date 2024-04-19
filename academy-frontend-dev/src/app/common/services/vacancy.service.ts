import {Injectable} from '@angular/core';
import {
  Application,
  QuestionWithAnswer,
  QuestionWithAnswerForServer
} from 'src/app/common/models/application.model';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {ApiResponse} from 'src/app/common/models/api-response.model';
import {
  Vacancy,
  VacancyCreationData,
  VacancyEditData,
  VacancyOptions,
  VacancyStatus,
  VacancyType
} from 'src/app/common/models/vacancy.model';
import {WindowService} from 'src/app/core/services/window.service';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  public vacancy$ = new Subject<Vacancy>();
  private vacanciesParams = {status: 'asc', opened: 'asc', page: 0};
  public amount = 0;
  public application$: BehaviorSubject<Application | null> =
    new BehaviorSubject<Application | null>(null);

  constructor(
    private http: HttpClient,
    private windowService: WindowService
  ) {}

  getVacancies(options: VacancyOptions = this.vacanciesParams): Observable<ApiResponse<Vacancy>> {
    const queryParams = {...options};

    return this.http.get<ApiResponse<Vacancy>>(`${environment.apiUrl}/vacancies`, {
      params: queryParams
    });
  }

  public setApplication(application: Application): void {
    this.application$.next(application);
  }

  public getApplicationById(id: string): Observable<Application> {
    return this.http.get<Application>(`${environment.apiUrl}/applications/for-admin/${id}`);
  }

  public setApplicationToLocalStorage(updatedQuestions: QuestionWithAnswer[]): void {
    const application = this.application$.getValue();
    if (application) {
      const updatedApplication = {...application};
      updatedApplication.questions = updatedQuestions;
      this.windowService.window?.localStorage.setItem(
        `application:${application._id}`,
        JSON.stringify(updatedApplication)
      );
    }
  }

  public getApplicationFromLocalStorage(applicationId: string): Application | null {
    const storedData = this.windowService.window?.localStorage.getItem(
      `application:${applicationId}`
    );
    if (storedData) {
      return JSON.parse(storedData);
    }

    return null;
  }

  public deleteApplicationFromLocalStorage(applicationId: string): void {
    this.windowService.window?.localStorage.removeItem(`application:${applicationId}`);
  }

  public sendEvaluatedApplication(id: string, questions: QuestionWithAnswer[]): Observable<any> {
    const formattedQuestions = this.mapQuestionsToServerDataFormat(questions);

    return this.http.patch(`${environment.apiUrl}/applications/${id}`, {
      questions: formattedQuestions,
      status: 'Evaluated'
    });
  }

  private mapQuestionsToServerDataFormat(
    questions: QuestionWithAnswer[]
  ): QuestionWithAnswerForServer[] {
    return questions.map(question => {
      const {vacancies, _id, ...remainingQuestion} = question;

      return {
        ...remainingQuestion,
        topics: remainingQuestion.topics?.map(topic => topic._id),
        type: remainingQuestion.type?._id,
        answer: {
          status: remainingQuestion.answer?.status,
          mark: remainingQuestion.answer?.mark,
          body: remainingQuestion.answer?.body,
          executionTime: remainingQuestion.answer?.executionTime
        }
      };
    });
  }

  getVacancyById(id: string): Observable<Vacancy> {
    return this.http.get<Vacancy>(`${environment.apiUrl}/vacancies/${id}`);
  }

  createVacancy(vacancyData: VacancyCreationData): Observable<Vacancy> {
    return this.http.post<Vacancy>(`${environment.apiUrl}/vacancies`, vacancyData);
  }

  deleteVacancy(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/vacancies/${id}`);
  }

  updateVacancy(id: string, vacancyData: VacancyEditData | VacancyStatus): Observable<Vacancy> {
    return this.http.patch<Vacancy>(`${environment.apiUrl}/vacancies/${id}`, vacancyData);
  }

  loadTypes(): Observable<ApiResponse<VacancyType>> {
    return this.http.get<ApiResponse<VacancyType>>(`${environment.apiUrl}/vacancy-types`);
  }
}
