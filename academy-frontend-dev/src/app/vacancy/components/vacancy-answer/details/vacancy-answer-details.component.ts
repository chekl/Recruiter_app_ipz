import {Component, OnDestroy, OnInit} from '@angular/core';
import {Location, NgIf} from '@angular/common';
import {VacancyTitleComponent} from 'src/app/common/components/vacancy-title/vacancy-title.component';
import {InfoCardComponent} from 'src/app/common/components/info-card/info-card.component';
import {Application} from 'src/app/common/models/application.model';
import {VacancyService} from 'src/app/common/services/vacancy.service';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {Router} from '@angular/router';
import {AnswerStatuses} from 'src/app/common/enums/enums';
import {forkJoin, Observable, Subject, takeUntil} from 'rxjs';
import {StorageService} from 'src/app/common/services/storage.service';
import {EmailService} from 'src/app/common/services/email.service';

@Component({
  standalone: true,
  imports: [VacancyTitleComponent, InfoCardComponent, NgIf],
  selector: 'ta-vacancy-answer-details',
  templateUrl: './vacancy-answer-details.component.html',
  styleUrls: ['./vacancy-answer-details.component.scss']
})
export class VacancyAnswerDetailsComponent implements OnInit, OnDestroy {
  public application: Application | null;
  protected readonly String = String;
  private untilSubject$: Subject<void> = new Subject<void>();
  public isReviewer: boolean;
  public isLoading = false;

  constructor(
    private location: Location,
    private router: Router,
    private vacancyService: VacancyService,
    private snackbarService: SnackbarService,
    private storageService: StorageService,
    private emailService: EmailService
  ) {}

  public navigateBack(): void {
    this.location.back();
  }

  public ngOnInit(): void {
    this.vacancyService.application$.pipe(takeUntil(this.untilSubject$)).subscribe(application => {
      this.application = application;
      this.isReviewer = this.storageService.getUser()?.email === application?.reviewer.email;
    });
  }

  public onSubmit(): void {
    if (!this.application) return;

    const application = this.vacancyService.getApplicationFromLocalStorage(this.application?._id);
    if (application) {
      this.processApplication(application);
    } else {
      this.handleNoApplicationFound();
    }
  }

  private processApplication(application: Application): void {
    if (this.checkIfAllAnswersEvaluated(application)) {
      this.showLoader();

      const sendEvaluatedApplication$ = this.vacancyService
        .sendEvaluatedApplication(application._id, application.questions)
        .pipe(takeUntil(this.untilSubject$));

      const sendEmail$ = this.emailService
        .sendEmailToApplicationCreator(application)
        .pipe(takeUntil(this.untilSubject$));

      forkJoin([sendEvaluatedApplication$, sendEmail$]).subscribe({
        next: () => {
          this.vacancyService.deleteApplicationFromLocalStorage(application._id);
          this.hideLoader();
          this.router.navigate(['vacancy/review']);
        },
        error: () => {
          this.snackbarService.showErrorSnackBar('Bad request');
          this.hideLoader();
        }
      });
    } else {
      this.showAnswersMustBeEvaluated();
    }
  }

  private showLoader(): void {
    this.isLoading = true;
  }

  private hideLoader(): void {
    this.isLoading = false;
  }

  private showAnswersMustBeEvaluated(): void {
    this.snackbarService.showErrorSnackBar('Evaluate all the answers first');
  }

  private handleNoApplicationFound(): void {
    if (this.checkIfAllAnswersEvaluated(this.application!)) {
      this.snackbarService.showErrorSnackBar('Answers have already been evaluated');
    } else {
      this.showAnswersMustBeEvaluated();
    }
  }

  private checkIfAllAnswersEvaluated(application: Application): boolean {
    const isAllQuestionsEvaluated: boolean = !application.questions.some(
      question => question.answer?.status !== AnswerStatuses.EVALUATED
    );

    return isAllQuestionsEvaluated;
  }

  ngOnDestroy() {
    this.untilSubject$.next();
    this.untilSubject$.complete();
  }
}
