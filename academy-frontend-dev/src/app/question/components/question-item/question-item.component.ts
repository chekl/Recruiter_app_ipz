import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TruncatePipe} from 'src/app/common/pipes/truncate.pipe';
import {Question} from 'src/app/common/models/question.model';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CreateEditFormComponent} from 'src/app/question/modal-form/create-edit-form/create-edit-form.component';
import {ModalConfirmComponent} from 'src/app/common/components/modal-confirm/modal-confirm.component';
import {QuestionService} from 'src/app/common/services/question.service';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {finalize, iif, of, Subject, switchMap, takeUntil} from 'rxjs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {QuestionDetailsFormComponent} from 'src/app/question/modal-form/view-question-details-form/question-details-form/question-details-form.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'ta-question-item',
  standalone: true,
  imports: [
    CommonModule,
    TruncatePipe,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './question-item.component.html',
  styleUrls: ['./question-item.component.scss']
})
export class QuestionItemComponent implements OnChanges, OnDestroy {
  @Input() isDefault: boolean = true;
  @Input() question: Question;
  @Input() isTaskQuestion: boolean = false;
  @Output() itemClicked: EventEmitter<Question> = new EventEmitter<Question>();
  @Output() removeClicked: EventEmitter<Question> = new EventEmitter<Question>();
  @Input() showRemoveIcon: boolean = true;

  public isRemovable: boolean;

  private untilSubject = new Subject<void>();

  constructor(
    private dialogRef: MatDialog,
    private questionService: QuestionService,
    private snackbar: SnackbarService
  ) {}

  onItemClick() {
    if (this.isTaskQuestion) {
      this.itemClicked.emit(this.question);
    } else {
      this.removeClicked.emit(this.question);
    }
  }

  ngOnChanges() {
    this.isRemovable = !this.question.vacancies.length;
  }

  ngOnDestroy() {
    this.untilSubject.next();
    this.untilSubject.complete();
  }

  public openModalDetailsQuestion() {
    this.dialogRef.open(QuestionDetailsFormComponent, {
      data: {
        questionData: this.question
      }
    });
  }

  public openEditModal() {
    this.dialogRef.open(CreateEditFormComponent, {
      data: {
        isEdit: true,
        questionData: this.question
      },
      disableClose: true
    });
  }

  public openRemoveModal() {
    if (!this.isRemovable) return;
    const dialogRef = this.dialogRef.open(ModalConfirmComponent, {
      data: {
        title: 'Remove question',
        description: `Remove \*${this.question.title}\*?`,
        mainButtonName: 'Remove'
      }
    });
    dialogRef
      .afterClosed()
      .pipe(
        switchMap(confirmed => iif(() => confirmed, this.deleteQuestion(), of(confirmed))),
        finalize(() => (this.isRemovable = true)),
        takeUntil(this.untilSubject)
      )
      .subscribe();
  }

  deleteQuestion() {
    this.isRemovable = false;
    return this.questionService.deleteQuestion(this.question._id).pipe(
      finalize(() => {
        this.snackbar.showSuccessSnackBar('The question has been successfully removed');
        this.questionService.getQuestions({
          update: true,
          filter: null,
          usePrevParams: true
        });
      })
    );
  }
}
