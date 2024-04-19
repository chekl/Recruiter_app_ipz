import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {QuestionItemComponent} from 'src/app/question/components/question-item/question-item.component';
import {
  Question,
  QuestionOptions,
  QuestionQueryParams,
  QuestionTopic
} from 'src/app/common/models/question.model';
import {
  VacancyCreationData,
  VacancyEditData,
  VacancyType
} from 'src/app/common/models/vacancy.model';
import {QuestionService} from 'src/app/common/services/question.service';
import {debounceTime, finalize, Observable, Subject, takeUntil} from 'rxjs';
import {MatDialog, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CreateEditFormComponent} from 'src/app/question/modal-form/create-edit-form/create-edit-form.component';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingService} from 'src/app/common/services/loading.service';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';
import {VacancyService} from 'src/app/common/services/vacancy.service';

@Component({
  selector: 'ta-create-vacancy',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    NgSelectModule,
    ReactiveFormsModule,
    QuestionItemComponent,
    MatDialogModule,
    InfiniteScrollModule,
    FormsModule,
    LoaderComponent,
    MatTooltipModule
  ],
  templateUrl: './create-edit-vacancy.component.html',
  styleUrls: ['./create-edit-vacancy.component.scss']
})
export class CreateEditVacancyComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput: ElementRef;
  isEditMode: boolean = false;
  isSearchActive: boolean = false;
  vacancyForm: FormGroup;
  types: VacancyType[];
  taskCounter: number = 0;
  totalTime: number = 0;
  searchQuery: string = '';
  vacancyId: string;
  questionTopics: QuestionTopic[];
  libraryQuestions: Question[] = [];
  taskQuestions: Question[] = [];
  taskQuestionIds: Set<string> = new Set();

  loading$: Observable<boolean>;
  private untilSubject$: Subject<void> = new Subject<void>();
  private searchInputSubject$ = new Subject<string>();

  constructor(
    private questionService: QuestionService,
    private dialogRef: MatDialog,
    private snackBarService: SnackbarService,
    private route: ActivatedRoute,
    private vacancyService: VacancyService,
    public loadingService: LoadingService,
    private router: Router
  ) {}

  get title() {
    return this.vacancyForm.get('title');
  }

  get type() {
    return this.vacancyForm.get('type');
  }

  get link() {
    return this.vacancyForm.get('link');
  }

  get description() {
    return this.vacancyForm.get('description');
  }

  get page(): number {
    return this.questionService.page;
  }

  ngOnInit() {
    this.loading$ = this.loadingService.loading$;
    this.initializeForm();
    this.loadQuestions();
    this.loadQuestionTopics();
    this.loadTypes();
    this.setSearchInputSubject();
    this.route.params.pipe(takeUntil(this.untilSubject$)).subscribe(params => {
      this.isEditMode = params['id'] !== undefined;
      if (this.isEditMode) {
        this.vacancyId = params['id'];
        this.loadVacancyData(this.vacancyId);
      }
    });
  }

  initializeForm() {
    this.vacancyForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(200)]),
      type: new FormControl(null, Validators.required),
      link: new FormControl('', [
        Validators.maxLength(2048),
        Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
      ]),
      description: new FormControl('', [Validators.required, Validators.maxLength(800)])
    });
  }

  loadVacancyData(id: string) {
    this.loadingService.loadingVacancies = true;
    this.vacancyService.getVacancyById(id).subscribe(vacancy => {
      this.vacancyForm.patchValue({
        title: vacancy.title,
        type: vacancy.type._id,
        link: vacancy.link,
        description: vacancy.description
      });
      this.taskQuestions = vacancy.questions || [];
      this.taskCounter = this.taskQuestions.length;
      this.totalTime = vacancy.executionTime;
      this.loadingService.loadingVacancies = false;
    });
  }

  loadQuestions() {
    this.questionService.limit = 10;
    this.questionService
      .getQuestions()
      .pipe(takeUntil(this.untilSubject$))
      .subscribe(questions => {
        this.libraryQuestions = questions.filter(
          question => !this.taskQuestionIds.has(question._id)
        );
      });
  }

  loadQuestionTopics() {
    this.questionService.getQuestionTopics().subscribe(topics => (this.questionTopics = topics));
  }

  loadTypes() {
    this.vacancyService.loadTypes().subscribe((res: {amount: number; data: VacancyType[]}) => {
      if (res.amount > 0) {
        this.types = res.data;
      }
    });
  }

  setSearchInputSubject() {
    this.searchInputSubject$
      .pipe(debounceTime(300), takeUntil(this.untilSubject$))
      .subscribe(input => this.searchQuestions(input));
  }

  onSearch(event: Event) {
    const value = (event.currentTarget as HTMLInputElement).value;

    if (
      value.length === 0 ||
      value
        .trim()
        .split(/[\s,\t\n]+/)
        .join(' ').length
    )
      this.searchInputSubject$.next(value);
  }

  toggleSearch(): void {
    this.isSearchActive = !this.isSearchActive;
    this.searchQuery = '';
    if (!this.isSearchActive) {
      this.loadQuestions();
    }
    if (this.isSearchActive) {
      setTimeout(() => this.focusSearchInput(), 0);
    }
  }

  private focusSearchInput() {
    if (this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  onQuestionItemClick(question: Question) {
    if (this.taskCounter >= 20) {
      this.snackBarService.showErrorSnackBar("Can't add more questions to the list");
      return;
    }

    this.taskQuestions.push(question);
    this.taskQuestionIds.add(question._id);
    this.taskCounter = this.taskQuestions.length;

    this.taskQuestions = [...this.taskQuestions.sort((a, b) => b.time - a.time)];

    this.totalTime += question.time;

    this.libraryQuestions = this.libraryQuestions.filter(
      libQuestion => libQuestion._id !== question._id
    );

    if (this.libraryQuestions.length < 10) {
      this.questionService.page += 1;
      this.questionService.getQuestions({
        usePrevParams: true,
        filter: null
      });
    }
  }

  onRemoveQuestionClick(question: Question) {
    this.taskQuestions = this.taskQuestions.filter(
      taskQuestion => taskQuestion._id !== question._id
    );
    this.taskQuestionIds.delete(question._id);
    this.taskCounter = this.taskQuestions.length;
    this.totalTime -= question.time;

    this.libraryQuestions.push(question);
    this.libraryQuestions = this.libraryQuestions.sort((a, b) => a.title.localeCompare(b.title));
  }

  private openModal(component: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    this.dialogRef.open(component, dialogConfig);
  }

  openModalAddEditQuestion() {
    this.openModal(CreateEditFormComponent);
  }

  onScroll() {
    this.questionService.page += 1;
    this.questionService.getQuestions({
      usePrevParams: true,
      filter: null
    });
  }

  createVacancy() {
    if (this.vacancyForm.valid) {
      if (this.taskQuestions.length > 0 && this.taskQuestions.length <= 20) {
        const vacancyData: VacancyCreationData = {
          title: this.title?.value,
          description: this.description?.value,
          type: this.type?.value,
          questions: this.taskQuestions.map(question => question._id)
        };

        if (this.link?.value) {
          vacancyData.link = this.link.value;
        }

        this.loadingService.updatingVacancies = true;

        this.vacancyService
          .createVacancy(vacancyData)
          .pipe(
            finalize(() => (this.loadingService.updatingVacancies = false)),
            takeUntil(this.untilSubject$)
          )
          .subscribe({
            next: () => {
              this.snackBarService.showSuccessSnackBar('Vacancy created successfully');
              this.router.navigate(['vacancy']);
              this.resetForm();
            },
            error: () => {
              this.snackBarService.showErrorSnackBar('Failed to create vacancy');
            }
          });
      } else {
        this.snackBarService.showErrorSnackBar("Task questions list can't be empty");
      }
    }
  }

  editVacancy() {
    if (this.vacancyForm.valid) {
      const vacancyData: VacancyEditData = {
        title: this.title?.value,
        description: this.description?.value,
        type: this.type?.value
      };

      if (this.link?.value) {
        vacancyData.link = this.link.value;
      }
      this.loadingService.updatingVacancies = true;
      this.vacancyService
        .updateVacancy(this.vacancyId, vacancyData)
        .pipe(
          finalize(() => (this.loadingService.updatingVacancies = false)),
          takeUntil(this.untilSubject$)
        )
        .subscribe({
          next: () => {
            this.router.navigate(['vacancy/info', this.vacancyId]);
            this.snackBarService.showSuccessSnackBar('The vacancy has been successfully updated');
          },
          error: () => {
            this.snackBarService.showErrorSnackBar('Failed to update vacancy');
          }
        });
    }
  }

  private resetForm() {
    this.vacancyForm.reset();
    this.taskQuestions = [];
    this.taskCounter = 0;
    this.totalTime = 0;
    this.loadQuestions();
  }

  searchQuestions(searchQuery: string): void {
    const topic = this.questionTopics.find(
      topic => topic.name.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    const filter: QuestionQueryParams = {
      ...(topic
        ? {topics: topic._id, title: ''}
        : {title: searchQuery.toString().toLowerCase().trim(), topics: null})
    };

    const options: QuestionOptions = {
      usePrevParams: false,
      filter: filter
    };

    this.questionService.getQuestions(options);
  }

  ngOnDestroy(): void {
    this.untilSubject$.next();
    this.untilSubject$.complete();
  }
}
