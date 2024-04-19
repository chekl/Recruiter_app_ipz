import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VacancyAnswerDetailsComponent} from 'src/app/vacancy/components/vacancy-answer/details/vacancy-answer-details.component';
import {MatTableModule} from '@angular/material/table';
import {Application, QuestionWithAnswer} from 'src/app/common/models/application.model';
import {ActivatedRoute} from '@angular/router';
import {VacancyService} from 'src/app/common/services/vacancy.service';
import {MatDialog, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import {AnswerEvaluateQuestionComponent} from 'src/app/question/components/answer-evaluate-question/answer-evaluate-question.component';
import {QuestionService} from 'src/app/common/services/question.service';
import {AnswerStatuses} from 'src/app/common/enums/enums';
import {Observable, Subject, takeUntil} from 'rxjs';
import {ModalQuestion} from 'src/app/candidate/models/candidate-test.model';
import {StorageService} from 'src/app/common/services/storage.service';
import {LoadingService} from 'src/app/common/services/loading.service';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    VacancyAnswerDetailsComponent,
    MatTableModule,
    MatDialogModule,
    LoaderComponent
  ],
  selector: 'ta-vacancy-answer',
  templateUrl: './vacancy-answer.component.html',
  styleUrls: ['./vacancy-answer.component.scss']
})
export class VacancyAnswerComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['question', 'status', 'mark', 'icon'];
  public application: Application;
  private untilSubject$: Subject<void> = new Subject<void>();
  protected readonly AnswerStatuses = AnswerStatuses;
  private question: QuestionWithAnswer;
  public isLoading: boolean = false;

  constructor(
    private vacancyService: VacancyService,
    private activatedRoute: ActivatedRoute,
    private dialogRef: MatDialog,
    private questionsService: QuestionService,
    private storageService: StorageService
  ) {}

  public ngOnInit(): void {
    this.isLoading = true;
    this.loadApplication();
    this.subscribeToQuestionChanges();
  }

  private loadApplication(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.vacancyService
      .getApplicationById(id)
      .pipe(takeUntil(this.untilSubject$))
      .subscribe(application => {
        this.handleLoadedApplication(application);
        this.isLoading = false;
      });
  }

  private handleLoadedApplication(application: Application): void {
    const localStorageApplication = this.vacancyService.getApplicationFromLocalStorage(
      application._id
    );
    this.application = localStorageApplication || application;
    this.vacancyService.setApplication(this.application);
    this.questionsService.setQuestionsWithAnswers(this.application.questions);
  }

  private subscribeToQuestionChanges(): void {
    this.questionsService.questionWithAnswers$
      .pipe(takeUntil(this.untilSubject$))
      .subscribe(question => {
        if (question) {
          this.question = question;
        }
      });
  }

  private openModal(component: any, data: ModalQuestion) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      data,
      isReviewer: this.storageService.getUser()?.email === this.application.reviewer.email
    };
    this.dialogRef.open(component, dialogConfig);
  }

  openModalDetailsAnswer(question: QuestionWithAnswer) {
    this.questionsService.setQuestionWithAnswers(question);
    this.openModal(AnswerEvaluateQuestionComponent, {
      isCandidate: false,
      amountOfQuestions: this.application.questions.length,
      currentQuestion: this.questionsService.getCurrentQuestionIndex(),
      question: this.question
    });
  }

  ngOnDestroy() {
    this.untilSubject$.next();
    this.untilSubject$.complete();
  }
}
