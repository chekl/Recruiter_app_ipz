import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {LoadingService} from 'src/app/common/services/loading.service';
import {Observable} from 'rxjs';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CreateEditFormComponent} from 'src/app/question/modal-form/create-edit-form/create-edit-form.component';
import {Question, QuestionQueryParams} from 'src/app/common/models/question.model';
import {Subject, takeUntil} from 'rxjs';
import {QuestionFormComponent} from 'src/app/question/components/question-form/question-form.component';
import {QuestionItemComponent} from 'src/app/question/components/question-item/question-item.component';
import {QuestionService} from 'src/app/common/services/question.service';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'ta-question-layout',
  standalone: true,
  templateUrl: './question-layout.component.html',
  styleUrls: ['./question-layout.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    QuestionFormComponent,
    QuestionItemComponent,
    LoaderComponent,
    MatDialogModule,
    InfiniteScrollModule
  ]
})
export class QuestionLayoutComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  questionList: Question[] = [];

  counter = 0;
  sortDirection: 'asc' | 'desc' = 'asc';

  get page(): number {
    return this.questionService.page;
  }

  get sortArrowSvgPath() {
    return this.sortDirection === 'asc'
      ? 'assets/icons/sort-up-arr.svg'
      : 'assets/icons/sort-down-arr.svg';
  }

  constructor(
    public loadingService: LoadingService,
    private dialogRef: MatDialog,
    public questionService: QuestionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    let filter = null;

    if (Object.keys(queryParams).length) {
      if (queryParams['order']) this.sortDirection = queryParams['order'];
      filter = queryParams;
    }

    this.questionService
      .getQuestions({
        usePrevParams: false,
        filter: filter
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((questions: Question[]) => {
        this.questionList = questions;
        this.counter = this.questionService.amount;
      });
  }

  sortQuestions() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    const filter = {field: 'time', order: this.sortDirection};

    this.questionService.getQuestions({
      usePrevParams: false,
      filter: filter
    });
    this.updateQueryParams(filter);
  }

  updateQueryParams(filter: QuestionQueryParams) {
    this.router.navigate([], {queryParams: filter, queryParamsHandling: 'merge'});
  }

  openModalAddEditQuestion() {
    this.dialogRef.open(CreateEditFormComponent, {
      disableClose: true
    });
  }

  onScroll(): void {
    this.questionService.page += 1;
    this.questionService.getQuestions({
      usePrevParams: true,
      filter: null
    });
  }

  private getQuestions() {
    this.questionService.limit = 7;
    this.questionService
      .getQuestions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((questions: Question[]) => {
        this.questionList = questions;
        this.counter = this.questionService.amount;
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
