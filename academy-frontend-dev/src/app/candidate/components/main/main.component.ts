import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {VacancyTitleComponent} from 'src/app/common/components/vacancy-title/vacancy-title.component';
import {InfoCardComponent} from 'src/app/common/components/info-card/info-card.component';
import {Observable, Subject, takeUntil} from 'rxjs';
import {TimeFormatPipe} from 'src/app/common/pipes/time-format.pipe';
import {AnswerEvaluateQuestionComponent} from 'src/app/question/components/answer-evaluate-question/answer-evaluate-question.component';
import {MatDialog, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import {ModalQuestion} from 'src/app/candidate/models/candidate-test.model';
import {CandidateTestService} from 'src/app/candidate/services/candidate-test.service';
import {Application, QuestionWithAnswer} from 'src/app/common/models/application.model';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {EmailService} from 'src/app/common/services/email.service';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';
import {LoadingService} from 'src/app/common/services/loading.service';
import {environment} from 'src/environments/environment';
import {ApplicationStatuses} from 'src/app/common/enums/enums';

@Component({
  selector: 'ta-main',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    VacancyTitleComponent,
    InfoCardComponent,
    TimeFormatPipe,
    AnswerEvaluateQuestionComponent,
    MatDialogModule,
    LoaderComponent
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnDestroy, OnInit {
  @ViewChild('desc', {static: false}) el: ElementRef<HTMLSpanElement>;
  private untilSubject$: Subject<void> = new Subject<void>();

  application: Application;
  applicationId: string | null;
  completedQuestionCount$ = this.candidateTestService.completedQuestionCount$;
  loading$: Observable<boolean>;
  protected readonly environment = environment;
  isSubmitted = false;
  isShowMore: boolean = true;
  truncated: boolean;

  columnsToDisplay = ['name', 'type', 'status'];

  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$;
    this.applicationId = this.activatedRoute.snapshot.paramMap.get('applicationId');
    this.candidateTestService
      .getApplicationById(this.applicationId as string)
      .pipe(takeUntil(this.untilSubject$))
      .subscribe({
        next: application => {
          if (application.status !== ApplicationStatuses.INVITED) {
            if (application.status !== ApplicationStatuses.IN_PROGRESS) {
              this.isSubmitted = true;
            }
            this.router.navigate(['candidate/sorry']);
          } else if (this.timeChecker(application.invited)) {
            this.candidateTestService
              .setApplicationStatus(application._id, ApplicationStatuses.IN_PROGRESS)
              .subscribe();
            this.application = application;
            setTimeout(() => this.checkOverflow(this.el?.nativeElement));
          } else {
            this.router.navigate(['candidate/sorry']);
          }
        },
        error: () => {
          this.router.navigate(['candidate/sorry']);
        }
      });

    window.addEventListener('beforeunload', this.beforeUnload);
  }

  ngOnDestroy(): void {
    if (!this.isSubmitted && this.applicationId) {
      this.candidateTestService
        .setApplicationStatus(this.applicationId, ApplicationStatuses.CLOSED)
        .subscribe();
    }
    window.removeEventListener('beforeunload', this.beforeUnload);
    this.untilSubject$.next();
    this.untilSubject$.complete();
  }

  constructor(
    private candidateTestService: CandidateTestService,
    private router: Router,
    private dialogRef: MatDialog,
    private activatedRoute: ActivatedRoute,
    private emailService: EmailService,
    private loadingService: LoadingService
  ) {}

  private openModal(component: any, data: ModalQuestion) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      data,
      nextQuestion: this.getTestQuestion.bind(this),
      saveAnswer: this.candidateTestService.setQuestionAnswer.bind(this.candidateTestService)
    };
    this.dialogRef.open(component, dialogConfig);
  }

  private beforeUnload(e: BeforeUnloadEvent) {
    e.preventDefault();
    return (e.returnValue = 'Are your sure?');
  }

  getTestQuestion(): QuestionWithAnswer {
    return this.application.questions[this.completedQuestionCount$.value];
  }

  submitTest(): void {
    this.candidateTestService.postCandidateAnswers(this.applicationId as string).subscribe();
    this.emailService.sendEmailToReviewer(this.applicationId as string).subscribe();
    this.isSubmitted = true;
    this.router.navigate(['candidate/thank-you']);
  }

  timeChecker(time: Date): boolean {
    const invitedDate = new Date(time);
    const expirationDate = new Date(invitedDate.getTime() + 72 * 60 * 60 * 1000);
    return Date.now() <= expirationDate.getTime();
  }

  openModalDetailsQuestion() {
    this.openModal(AnswerEvaluateQuestionComponent, {
      isCandidate: true,
      question: this.getTestQuestion(),
      currentQuestion: this.completedQuestionCount$.value + 1,
      amountOfQuestions: this.application.vacancy.questions.length
    });
  }

  showMore(span: HTMLSpanElement, descriptionEl: HTMLDivElement): void {
    descriptionEl.style.display = this.isShowMore ? 'flex' : 'inline-flex';
    this.isShowMore = !this.isShowMore;
    span.classList.toggle('text-ellipsis');
    this.checkOverflow(span);
  }

  checkOverflow(element: HTMLSpanElement): void {
    this.truncated = element?.offsetWidth < element?.scrollWidth;
  }
}
