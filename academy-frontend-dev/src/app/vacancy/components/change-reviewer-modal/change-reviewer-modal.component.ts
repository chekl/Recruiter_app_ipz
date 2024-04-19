import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {Observable, Subject, debounceTime, of, startWith, switchMap, takeUntil} from 'rxjs';
import {Application, Reviewer} from 'src/app/common/models/application.model';
import {ChangeReviewerModalService} from 'src/app/common/services/change-reviewer-modal.service';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {ApplicationsService} from 'src/app/common/services/applications.service';
import {ModalComponent} from 'src/app/common/components/modal/modal.component';

@Component({
  selector: 'ta-change-reviewer-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    ModalComponent
  ],
  templateUrl: './change-reviewer-modal.component.html',
  styleUrls: ['./change-reviewer-modal.component.scss']
})
export class ChangeReviewerModalComponent implements OnInit {
  @Output() changeReviewerEvent = new EventEmitter<Application[]>();

  private untilSubject$: Subject<void> = new Subject<void>();
  private _emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  reviewerList: Reviewer[] = [];
  reviewer: Reviewer;
  emailCtrl = new FormControl('', Validators.pattern(this._emailPattern));
  filteredReviewers: Observable<Reviewer[]>;
  isSelected = false;

  constructor(
    private dialogRef: MatDialogRef<ChangeReviewerModalComponent>,
    private changeReviewerModalService: ChangeReviewerModalService,
    private snackbar: SnackbarService,
    private applicationService: ApplicationsService
  ) {}

  get isFormValid() {
    return this.emailCtrl.valid;
  }

  ngOnInit(): void {
    this.filteredReviewers = this.emailCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(email =>
        email ? this.changeReviewerModalService.getReviewers(email as string) : of([])
      ),
      takeUntil(this.untilSubject$)
    );
    this.emailCtrl.valueChanges.pipe(takeUntil(this.untilSubject$)).subscribe(() => {
      this.isSelected = false;
    });
    this.changeReviewerModalService.reviewer$
      .pipe(takeUntil(this.untilSubject$))
      .subscribe(reviewers => (this.reviewerList = reviewers));
    this.filteredReviewers
      .pipe(takeUntil(this.untilSubject$))
      .subscribe(reviewers => (this.reviewerList = reviewers));
    this.applicationService.reviewerChange$.pipe(takeUntil(this.untilSubject$));
  }

  setReviewer(email: string): void {
    this.reviewer = this.reviewerList.find(reviewer => reviewer.email === email) as Reviewer;
    this.isSelected = true;
  }

  onSubmit(form: NgForm) {
    if (this.isSelected) {
      const newReviewerId = this.reviewer._id;
      this.applicationService.changeReviewer(newReviewerId).subscribe(applications => {
        this.changeReviewerEvent.emit(applications);
      });
    }
    if (form.submitted && this.isFormValid) {
      this.snackbar.showSuccessSnackBar('The reviewer was changed successfully');
      this.closeModal();
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.untilSubject$.next();
    this.untilSubject$.complete();
  }
}
