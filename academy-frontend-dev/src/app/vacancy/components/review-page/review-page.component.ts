import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {Router, RouterModule} from '@angular/router';
import {ApplicationsService} from 'src/app/common/services/applications.service';
import {Subject, takeUntil} from 'rxjs';
import {StorageService} from 'src/app/common/services/storage.service';
import {Application} from 'src/app/common/models/application.model';
import {SortOrder} from 'src/app/common/types/sort-order.type';
import {LoadingService} from 'src/app/common/services/loading.service';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';

@Component({
  selector: 'ta-review-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, LoaderComponent],
  templateUrl: './review-page.component.html',
  styleUrls: ['./review-page.component.scss']
})
export class ReviewPageComponent implements OnInit, OnDestroy {
  constructor(
    private applicationsService: ApplicationsService,
    private storageService: StorageService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public navigateBack(): void {
    this.router.navigate(['vacancy']);
  }

  private ngUnsubscribe = new Subject<void>();

  public displayedColumns: string[] = ['vacancy', 'type', 'candidate', 'completed', 'icon'];
  public applications: Application[] = [];
  public completedSortOrder: SortOrder = 'desc';
  public loading$ = this.loadingService.loading$;

  fetchApplications(completed?: SortOrder) {
    const user = this.storageService.getUser();
    if (user) {
      this.applicationsService
        .getApplicationsNeedReview(user._id, completed)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(applications => {
          this.applications = applications;
        });
    }
  }

  changeSortOrder() {
    this.completedSortOrder = this.completedSortOrder === 'asc' ? 'desc' : 'asc';
    this.fetchApplications(this.completedSortOrder);
  }

  navigateToApplicationAnswers(id: string): void {
    this.router.navigate([`vacancy/application/${id}`]);
  }
}
