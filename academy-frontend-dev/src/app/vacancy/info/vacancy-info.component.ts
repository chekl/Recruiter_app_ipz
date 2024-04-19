import {Component, OnDestroy, OnInit} from '@angular/core';
import {VacancyService} from 'src/app/common/services/vacancy.service';
import {Application} from 'src/app/common/models/application.model';
import {Observable, takeUntil, Subject, of, iif, switchMap, tap, BehaviorSubject} from 'rxjs';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {VacancyInfoDetailsComponent} from 'src/app/vacancy/info/details/vacancy-info-details.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ChangeReviewerModalComponent} from '../components/change-reviewer-modal/change-reviewer-modal.component';
import {ApplicationsService} from 'src/app/common/services/applications.service';
import {ModalConfirmComponent} from 'src/app/common/components/modal-confirm/modal-confirm.component';
import {InviteCandidateModalComponent} from 'src/app/vacancy/components/invite-candidate-modal/invite-candidate-modal.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ActivatedRoute, Router} from '@angular/router';
import {Vacancy} from 'src/app/common/models/vacancy.model';
import {VacancyStatuses} from 'src/app/common/enums/enums';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';
import {LoadingService} from 'src/app/common/services/loading.service';
import {SnackbarService} from 'src/app/core/services/snackbar.service';

@Component({
  standalone: true,
  selector: 'ta-vacancy-info',
  templateUrl: './vacancy-info.component.html',
  styleUrls: ['./vacancy-info.component.scss'],
  imports: [
    MatTableModule,
    VacancyInfoDetailsComponent,
    CommonModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    LoaderComponent
  ]
})
export class VacancyInfoComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['candidate', 'status', 'score', 'reviewer', 'invited'];
  public vacancy: Vacancy;
  public vacancySubject = new BehaviorSubject<Vacancy>({} as Vacancy);
  private ngUnsubscribe = new Subject<void>();
  public selection = new SelectionModel<Application>(true, []);
  loading$: Observable<boolean>;
  public sortDirection: 'asc' | 'desc' = 'asc';
  public pageIndex = 0;
  public pageSize = 10;

  public sortedApplications: Application[] = [];
  public sortedField: string = 'status';

  constructor(
    private vacancyService: VacancyService,
    private applicationService: ApplicationsService,
    private myDialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private snackbar: SnackbarService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadVacancy();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadVacancy() {
    const id: string | null = this.activatedRoute.snapshot.paramMap.get('id');
    this.loading$ = this.loadingService.loading$;
    this.vacancyService
      .getVacancyById(id as string)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.vacancy = res;
        this.vacancySubject.next(res);
        this.sortApplications();
      });
  }

  sortApplications() {
    this.sortedApplications = this.vacancy.applications
      .slice()
      .sort((a, b) => {
        const direction = this.sortDirection === 'asc' ? 1 : -1;
        return a.status.localeCompare(b.status) * direction;
      })
      .slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.sortApplications();
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortApplications();
  }

  onVacancyStatusChanged(payload: {isReopen: boolean; vacancy: Vacancy}) {
    if (!payload.isReopen) {
      this.vacancy.applications = payload.vacancy.applications;
      this.sortApplications();
    }
    this.vacancy = payload.vacancy;
    this.selection.clear();
  }

  onApplicationToggleSelect(application: Application) {
    this.selection.toggle(application);
  }

  isAllSelected() {
    return this.selection.selected?.length === this.vacancy.applications?.length;
  }

  toggleAllSelect() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.vacancy.applications);
    }
  }

  shouldShowChangeButton(): boolean {
    return !this.selection.selected.some(
      element =>
        element.status.toUpperCase() === 'EVALUATED' || element.status.toUpperCase() === 'CLOSED'
    );
  }

  setSelectedApplications() {
    const selectedApplications = this.selection.selected;
    this.applicationService.selectedApplicationsSubject.next(selectedApplications);
  }

  removeCandidate() {
    this.setSelectedApplications();
    return this.applicationService.removeApplications().pipe(
      tap(() => {
        this.vacancy.applications = this.vacancy.applications.filter(
          app => !this.selection.selected.map(application => application._id).includes(app._id)
        );
        this.vacancySubject.next(this.vacancy);
        this.selection.clear();
        this.snackbar.showSuccessSnackBar('The candidate was removed successfully');
        this.sortApplications();
      })
    );
  }

  inviteCandidate() {
    if (this.vacancy.status !== VacancyStatuses.CLOSED) {
      const dialogRef = this.myDialog.open(InviteCandidateModalComponent, {
        data: this.vacancy
      });
      dialogRef.componentInstance.inviteEvent
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(application => {
          this.vacancy.applications = [...this.vacancy.applications, application];
          this.sortApplications();
        });
    }
  }

  changeOneReviewer(event: Event, element: Application) {
    event.stopPropagation();

    this.selection.clear();
    this.selection.select(element);
    this.changeReviewer();
  }

  changeReviewer() {
    this.setSelectedApplications();
    const dialogRef = this.myDialog.open(ChangeReviewerModalComponent, {data: this.vacancy});
    dialogRef.componentInstance.changeReviewerEvent
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(applications => {
        this.vacancy.applications = this.vacancy.applications.map(app => {
          applications.forEach(newApp => {
            if (app._id === newApp._id) app = newApp;
          });
          return app;
        });
        this.sortApplications();
      });
    this.selection.clear();
  }

  canBeReviewed(status: string): boolean {
    return status.toUpperCase() !== 'EVALUATED' && status.toUpperCase() !== 'COMPLETED';
  }

  openModalRemove() {
    const dialogRef = this.myDialog.open(ModalConfirmComponent, {
      data: {
        title: this.selection.selected.length > 1 ? 'Remove all candidates' : 'Remove candidate',
        description: `Are you sure you want to remove ${
          this.selection.selected.length > 1 ? '*all candidates*' : '*candidate*'
        }?`,
        mainButtonName: this.selection.selected.length > 1 ? 'Remove all' : 'Remove'
      }
    });
    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap(confirmed => iif(() => confirmed, this.removeCandidate(), of(confirmed)))
      )
      .subscribe();
  }

  private navigateToAnswersPage(applicationId: string): void {
    this.router.navigate([`vacancy/application/${applicationId}`]);
  }

  public handleButtonClick(id: string, status: string): void {
    if (!this.canBeReviewed(status)) {
      this.navigateToAnswersPage(id);
    }
  }

  protected readonly VacancyStatuses = VacancyStatuses;
}
