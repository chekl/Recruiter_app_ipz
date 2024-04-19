import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {QuestionService} from 'src/app/common/services/question.service';
import {debounceTime, Observable, Subject, takeUntil} from 'rxjs';
import {questionFilterTitleValidator} from 'src/app/utils/question-filter-title-validator';
import {distinctUntilChanged, filter} from 'rxjs/operators';
import {
  QuestionQueryParams,
  QuestionTopic,
  QuestionType
} from 'src/app/common/models/question.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingService} from 'src/app/common/services/loading.service';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';

@Component({
  selector: 'ta-question-form',
  standalone: true,
  templateUrl: './question-form.component.html',
  styleUrls: ['./question-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, LoaderComponent]
})
export class QuestionFormComponent implements OnInit, OnDestroy {
  private untilSubject$: Subject<void> = new Subject<void>();

  types$: Observable<QuestionType[]>;
  topics$: Observable<QuestionTopic[]>;

  filterQuestionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public loadingService: LoadingService
  ) {}

  get title() {
    return this.filterQuestionForm.get('title');
  }

  ngOnInit(): void {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    let topics: string[] = [];

    if (queryParams['topics'])
      if (typeof queryParams['topics'] === 'string') topics = [queryParams['topics']];
      else topics = [...queryParams['topics']];

    this.filterQuestionForm = this.fb.group({
      title: [queryParams['title'] || '', [questionFilterTitleValidator()]],
      type: [queryParams['type'] || null],
      topics: [topics]
    });

    this.filterQuestionForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        filter(() => this.filterQuestionForm.valid),
        takeUntil(this.untilSubject$)
      )
      .subscribe(filter => {
        this.questionService.getQuestions({
          usePrevParams: false,
          filter: filter
        });
        this.updateQueryParams(filter);
      });
    this.getAllTypes();
    this.getAllTopics();
  }

  updateQueryParams(filter: QuestionQueryParams) {
    if (!filter['title']) filter['title'] = null;

    this.router.navigate([], {queryParams: filter, queryParamsHandling: 'merge'});
  }

  getAllTypes(): void {
    this.types$ = this.questionService.getQuestionTypes();
  }

  getAllTopics(): void {
    this.topics$ = this.questionService.getQuestionTopics();
  }

  onFocus(input: HTMLInputElement): void {
    input.placeholder = 'Type at least 3 characters';
  }

  onBlur(input: HTMLInputElement): void {
    input.placeholder = 'Type question title';
  }

  ngOnDestroy(): void {
    this.untilSubject$.next();
    this.untilSubject$.complete();
  }
}
