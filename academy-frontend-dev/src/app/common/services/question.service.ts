import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {
  Question,
  QuestionOptions,
  QuestionTopic,
  QuestionType
} from 'src/app/common/models/question.model';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {getHttpParamsFromObject} from 'src/app/utils/get-http-params-from-object';
import {ApiResponse} from 'src/app/common/models/api-response.model';
import {QUESTION_LIMIT} from 'src/app/common/constants/question.constants';
import {VacancyService} from 'src/app/common/services/vacancy.service';
import {AnswerStatuses} from 'src/app/common/enums/enums';
import {QuestionWithAnswer} from 'src/app/common/models/application.model';
import {LoadingService} from 'src/app/common/services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questions$ = new BehaviorSubject<Question[]>([]);
  private topics$ = new BehaviorSubject<QuestionTopic[]>([]);
  private types$ = new BehaviorSubject<QuestionType[]>([]);
  private questionOptions = {usePrevParams: false, filter: null};
  private questionsWithAnswers$ = new BehaviorSubject<QuestionWithAnswer[]>([]);
  public questionWithAnswers$ = new BehaviorSubject<QuestionWithAnswer | null>(null);

  public amount = 0;
  private _limit = QUESTION_LIMIT;
  private isLimitReached = false;
  private _page = 0;

  get page() {
    return this._page;
  }

  set page(value: number) {
    if (value === 0) this.isLimitReached = false;
    this._page = value;
  }

  get limit() {
    return this._limit;
  }

  set limit(value: number) {
    this._limit = value < 1 ? QUESTION_LIMIT : value;
  }

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private vacancyService: VacancyService
  ) {}

  public setMark(mark: number): void {
    const question = this.questionWithAnswers$.getValue();
    const questions = this.questionsWithAnswers$.getValue();
    if (question && questions) {
      const updatedQuestions = questions.map(existingQuestion => {
        if (existingQuestion._id === question._id) {
          return {
            ...existingQuestion,
            answer: {
              ...existingQuestion.answer,
              mark: mark,
              status: AnswerStatuses.EVALUATED
            }
          };
        }
        return existingQuestion;
      });
      this.vacancyService.setApplicationToLocalStorage(updatedQuestions);
      if (question.answer) {
        question.answer.mark = mark;
        question.answer.status = AnswerStatuses.EVALUATED;
      }
      this.questionsWithAnswers$.next(updatedQuestions);
    }
  }

  public setQuestionsWithAnswers(questions: QuestionWithAnswer[]): void {
    this.questionsWithAnswers$.next(questions);
  }

  public setQuestionWithAnswers(question: QuestionWithAnswer): void {
    this.questionWithAnswers$.next(question);
  }

  public setAnotherQuestion(isPreviousQuestion: boolean): void {
    const questions = this.questionsWithAnswers$.getValue();
    const currentQuestionIndex = questions.findIndex(
      q => q._id === this.questionWithAnswers$.getValue()?._id
    );
    if (isPreviousQuestion) {
      this.setQuestionWithAnswers(
        currentQuestionIndex >= 1
          ? questions[currentQuestionIndex - 1]
          : questions[currentQuestionIndex]
      );
    } else {
      this.setQuestionWithAnswers(
        currentQuestionIndex < questions.length - 1
          ? questions[currentQuestionIndex + 1]
          : questions[currentQuestionIndex]
      );
    }
  }

  public getCurrentQuestionIndex(): number {
    const questions = this.questionsWithAnswers$.getValue();
    return questions.findIndex(q => q._id === this.questionWithAnswers$.getValue()?._id) + 1;
  }

  public getCurrentQuestion(): QuestionWithAnswer | null {
    return this.questionWithAnswers$.getValue();
  }

  getQuestions(options: QuestionOptions = this.questionOptions): Observable<Question[]> {
    this.updatePage(options);
    const params = getHttpParamsFromObject(
      options.filter,
      options.usePrevParams,
      this.page,
      this.limit
    );

    if (!this.isLimitReached) {
      this.loadingService.loadingQuestions = true;
      this.http
        .get<ApiResponse<Question>>(`${environment.apiUrl}/questions`, {params})
        .subscribe(res => {
          this.amount = res.amount;
          this.isLimitReached = this.checkIfLimitIsReached();

          if (options.usePrevParams && !options.update)
            this.questions$.next([...this.questions$.value, ...res.data]);
          else this.questions$.next(res.data);
          this.loadingService.loadingQuestions = false;
        });
    }

    return this.questions$.asObservable();
  }

  getQuestionTypes(): Observable<QuestionType[]> {
    this.loadingService.loadingQuestionTypes = true;
    this.http
      .get<ApiResponse<QuestionType>>(`${environment.apiUrl}/question-types`)
      .pipe(map(res => (res.amount > 0 ? res.data : [])))
      .subscribe(types => {
        this.types$.next(types);
        this.loadingService.loadingQuestionTypes = false;
      });

    return this.types$.asObservable();
  }

  getQuestionTopics(): Observable<QuestionTopic[]> {
    this.loadingService.loadingQuestionTopics = true;
    this.http
      .get<ApiResponse<QuestionTopic>>(`${environment.apiUrl}/topics`)
      .pipe(map(res => (res.amount > 0 ? res.data : [])))
      .subscribe(topics => {
        this.topics$.next(topics);
        this.loadingService.loadingQuestionTopics = false;
      });

    return this.topics$.asObservable();
  }

  deleteQuestion(id: string) {
    this.page = 0;
    return this.http.delete(`${environment.apiUrl}/questions/${id}`);
  }

  updateQuestion(id: string, question: Question) {
    this.page = 0;
    return this.http.patch<Question>(`${environment.apiUrl}/questions/${id}`, question);
  }

  addQuestion(questionData: {}) {
    this.page = 0;
    return this.http.post<Question>(`${environment.apiUrl}/questions`, questionData);
  }

  private checkIfLimitIsReached() {
    return this.page >= Math.floor(this.amount / this.limit);
  }

  private updatePage(options: QuestionOptions): void {
    if (options.filter || (!options.filter && !options.usePrevParams)) this.page = 0;
  }
}
