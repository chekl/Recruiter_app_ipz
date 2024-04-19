import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {VacancyService} from 'src/app/common/services/vacancy.service';
import {Vacancy, VacancyOptions} from 'src/app/common/models/vacancy.model';
import {BehaviorSubject, Observable, Subject, flatMap, takeUntil} from 'rxjs';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {StorageService} from 'src/app/common/services/storage.service';
import {LoadingService} from 'src/app/common/services/loading.service';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';
import {ApplicationsService} from 'src/app/common/services/applications.service';

@Component({
  selector: 'ta-vacancy-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    RouterModule,
    InfiniteScrollModule,
    LoaderComponent
  ],
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss'],
  providers: []
})
export class VacancyListComponent implements OnInit {
  constructor(
    private router: Router,
    private vacancyService: VacancyService,
    private storageService: StorageService,
    private applicationsService: ApplicationsService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getVacancies({status: this.statusSort, opened: this.openedSort, page: this.page})
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(vacancy => {
        this.vacancies = vacancy;
      });
    const user = this.storageService.getUser();
    if (user) {
      this.loadingService.loadingApplications = true;
      this.applicationsService
        .getApplicationsNeedReview(user._id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(applications => {
          this.needReviewCounter = applications.length;
          this.loadingService.loadingApplications = false;
        });
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private ngUnsubscribe = new Subject<void>();
  private vacancies$ = new BehaviorSubject<Vacancy[]>([]);
  private endOfList = false;
  private page = 0;

  displayedColumns: string[] = ['vacancy', 'type', 'status', 'opened'];
  vacanciesCounter: number = 0;
  scrollDistance = 1;
  vacancies: Vacancy[] = [];
  statusSort = 'asc';
  openedSort = 'desc';

  public needReviewCounter: number;

  getVacancies(options: VacancyOptions): Observable<Vacancy[]> {
    this.loadingService.loadingVacancies = true;
    if (this.endOfList) {
      return this.vacancies$.asObservable();
    }

    this.vacancyService.getVacancies(options).subscribe(res => {
      this.vacancyService.amount = res.amount;

      if (this.page === 0) {
        this.vacancies$.next(res.data);
      } else {
        this.vacancies$.next([...this.vacancies$.getValue(), ...res.data]);
      }

      if (res.data.length === 0) {
        this.endOfList = true;
      }
      this.loadingService.loadingVacancies = false;
    });

    return this.vacancies$.asObservable();
  }

  loadVacancies(): void {
    this.getVacancies({
      status: this.statusSort,
      opened: this.openedSort,
      page: this.page
    }).subscribe(vacancy => {
      this.vacancies = vacancy;
      this.vacanciesCounter = this.vacancyService.amount;
    });
  }

  onScroll() {
    if (!this.endOfList) {
      this.page += 1;
      this.loadVacancies();
    }
  }

  sortByStatus(): void {
    this.page = 0;
    this.endOfList = false;

    this.statusSort = this.statusSort === 'asc' ? 'desc' : 'asc';
    this.getVacancies({
      status: this.statusSort,
      opened: this.openedSort,
      page: this.page
    }).subscribe(vacancy => {
      this.vacancies = vacancy;
    });
  }

  sortByOpened(): void {
    this.page = 0;
    this.endOfList = false;

    this.openedSort = this.openedSort === 'asc' ? 'desc' : 'asc';

    this.getVacancies({
      status: this.statusSort,
      opened: this.openedSort,
      page: this.page
    }).subscribe(vacancy => {
      this.vacancies = vacancy;
    });
  }

  public navigateToProduct(id: string): void {
    this.router.navigate(['vacancy/info', id]);
  }
}
