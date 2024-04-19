import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {VacancyTitleComponent} from 'src/app/common/components/vacancy-title/vacancy-title.component';
import {InfoCardComponent} from 'src/app/common/components/info-card/info-card.component';
import {Router, RouterLink} from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ModalConfirmComponent} from 'src/app/common/components/modal-confirm/modal-confirm.component';
import {Vacancy, VacancyStatus} from 'src/app/common/models/vacancy.model';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {
  BehaviorSubject,
  catchError,
  finalize,
  iif,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import {VacancyService} from 'src/app/common/services/vacancy.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    VacancyTitleComponent,
    VacancyTitleComponent,
    InfoCardComponent,
    RouterLink,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule
  ],
  selector: 'ta-vacancy-info-details',
  templateUrl: 'vacancy-info-details.component.html',
  styleUrls: ['./vacancy-info-details.component.scss']
})
export class VacancyInfoDetailsComponent implements OnDestroy, OnInit {
  @Input() vacancySubject: BehaviorSubject<Vacancy>;
  @Output() vacancyStatusChanged = new EventEmitter<{isReopen: boolean; vacancy: Vacancy}>();

  isVacancyStatusChanging = false;
  isRemoveButtonDisabled = false;

  constructor(
    private myDialog: MatDialog,
    private vacancyService: VacancyService,
    private snackBarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.vacancySubject.asObservable().subscribe(vacancy => {
      this.vacancy = vacancy;
      this.completed = this.vacancy.applications.reduce((count, app) => {
        return count + (app.status === 'Completed' || app.status === 'Evaluated' ? 1 : 0);
      }, 0);
    });
  }

  ngOnDestroy(): void {
    this.untilSubject.next();
    this.untilSubject.complete();
  }

  private untilSubject = new Subject<void>();
  public completed: number;
  public vacancy: Vacancy;

  public navigateBack(): void {
    this.router.navigate(['vacancy']);
  }

  confirmDeleteModal() {
    if (this.vacancy.status !== 'Closed') return;
    const dialogRef = this.myDialog.open(ModalConfirmComponent, {
      data: {
        title: 'Remove vacancy',
        description:
          'Do you want to remove this vacancy? *All the candidate&#39s applications will be removed* as well.',
        mainButtonName: 'Remove'
      }
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap(confirmed => iif(() => confirmed, this.deleteVacancy(), of(confirmed))),
        finalize(() => (this.isRemoveButtonDisabled = false)),
        takeUntil(this.untilSubject)
      )
      .subscribe();
  }

  deleteVacancy() {
    this.isRemoveButtonDisabled = true;
    return this.vacancyService.deleteVacancy(this.vacancy._id).pipe(
      finalize(() => {
        this.router.navigate(['vacancy']);
        this.snackBarService.showSuccessSnackBar('The vacancy has been successfully removed');
      })
    );
  }

  closeVacancy(isReopen: boolean) {
    const newStatus = isReopen ? 'Active' : 'Closed';
    const vacancyData: VacancyStatus = {
      status: newStatus
    };

    if (isReopen) {
      this.isRemoveButtonDisabled = true;
      vacancyData.opened = new Date().toISOString();
    }

    this.myDialog.closeAll();

    this.isVacancyStatusChanging = true;
    return this.vacancyService.updateVacancy(this.vacancy._id, vacancyData).pipe(
      catchError(err => {
        const errorMessage = isReopen ? 'Failed to reopen vacancy' : 'Failed to close vacancy';
        this.snackBarService.showErrorSnackBar(errorMessage);
        throw err;
      }),
      tap(vacancy => {
        const successMessage = isReopen
          ? 'Vacancy has been successfully reopened'
          : 'Vacancy has been successfully closed';
        this.snackBarService.showSuccessSnackBar(successMessage);
        this.vacancySubject.next(vacancy);
        this.vacancyStatusChanged.emit({isReopen, vacancy});
      })
    );
  }

  canBeDeleted(status: string): boolean {
    return status.toUpperCase() !== 'CLOSED';
  }

  public openModalCloseVacancy(): void {
    const isReopen = this.vacancy.status === 'Closed';

    const dialogRef = this.myDialog.open(ModalConfirmComponent, {
      data: {
        title: isReopen ? 'Re-open vacancy' : 'Close vacancy',
        description: isReopen
          ? 'Do you want to re-open this vacancy?'
          : 'Do you want to close this vacancy? *All the candidate&#39s applications will be closed* as well.',
        mainButtonName: 'Confirm'
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap(confirmed => iif(() => confirmed, this.closeVacancy(isReopen), of(confirmed))),
        finalize(() => {
          this.isVacancyStatusChanging = false;
          this.isRemoveButtonDisabled = false;
        }),
        takeUntil(this.untilSubject)
      )
      .subscribe();
  }

  openLink() {
    if (!this.vacancy.link) return;
    window.open(this.vacancy.link);
  }
}
