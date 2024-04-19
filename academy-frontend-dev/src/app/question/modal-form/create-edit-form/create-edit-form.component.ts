import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NgSelectModule} from '@ng-select/ng-select';
import {formatTime} from 'src/app/utils/modal-form.utils';
import {FieldWrapperComponent} from 'src/app/question/modal-form/field-wrapper/field-wrapper.component';
import {ValidationMessageComponent} from 'src/app/question/modal-form/validation-message/validation-message.component';
import {Question, QuestionTopic, QuestionType} from 'src/app/common/models/question.model';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {QuestionService} from 'src/app/common/services/question.service';
import {Subject, distinctUntilChanged, takeUntil, finalize} from 'rxjs';
import {MatIconModule} from '@angular/material/icon';
import {ModalComponent} from 'src/app/common/components/modal/modal.component';
import {maxTopicsValidator} from 'src/app/utils/topics-validator';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';

@Component({
  selector: 'create-edit-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    NgSelectModule,
    FieldWrapperComponent,
    ValidationMessageComponent,
    ModalComponent,
    MatIconModule,
    LoaderComponent
  ],
  templateUrl: './create-edit-form.component.html',
  styleUrls: ['./create-edit-form.component.scss']
})
export class CreateEditFormComponent implements OnInit, OnDestroy {
  @Input() topics: QuestionTopic[];
  @Input() types: QuestionType[];

  questionForm: FormGroup;
  initialFormValue: FormGroup;
  hasChanged: boolean = false;
  timeChanged: boolean = false;
  isSubmitInProgress = false;

  private untilSubject = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialog,
    private questionsService: QuestionService,
    private snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public modalData?: {isEdit: boolean; questionData: Question}
  ) {}

  ngOnInit(): void {
    this.questionsService
      .getQuestionTopics()
      .pipe(takeUntil(this.untilSubject))
      .subscribe(topics => (this.topics = topics));
    this.questionsService
      .getQuestionTypes()
      .pipe(takeUntil(this.untilSubject))
      .subscribe(types => (this.types = types));
    this.initForm();
  }

  ngOnDestroy(): void {
    this.untilSubject.next();
    this.untilSubject.complete();
  }

  initForm() {
    this.questionForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', [Validators.required, Validators.maxLength(800)]],
      topics: [[], [Validators.required, maxTopicsValidator(5)]],
      type: [null, Validators.required],
      time: [0, [Validators.required, Validators.min(1)]]
    });

    if (this.modalData?.questionData) {
      this.questionForm.patchValue({
        ...this.modalData.questionData,
        topics: this.modalData.questionData.topics.map(topic => topic._id),
        type: this.modalData.questionData.type._id
      });

      this.initialFormValue = this.questionForm.value;
      this.questionForm.valueChanges
        .pipe(
          distinctUntilChanged((prev, curr) => {
            const check = JSON.stringify(curr) === JSON.stringify(this.initialFormValue);
            if (check) this.hasChanged = false;
            return check;
          }),
          takeUntil(this.untilSubject)
        )
        .subscribe(() => (this.hasChanged = true));
    }
  }

  closeModal() {
    this.dialogRef.closeAll();
  }

  onSubmit() {
    if (this.modalData?.isEdit && this.modalData.questionData) {
      if (!this.hasChanged) return;
      this.setSubmitInProgress(true);
      this.questionsService
        .updateQuestion(this.modalData.questionData._id, this.questionForm.value)
        .pipe(
          finalize(() => this.setSubmitInProgress(false)),
          takeUntil(this.untilSubject)
        )
        .subscribe(() => {
          this.closeModal();
          this.snackbar.showSuccessSnackBar('The question has been successfully edited');
          this.questionsService.getQuestions({filter: null, usePrevParams: true, update: true});
          this.questionsService.getQuestionTopics();
        });
    } else {
      if (this.questionForm.valid) {
        this.setSubmitInProgress(true);
        this.questionsService
          .addQuestion(this.questionForm.value)
          .pipe(
            finalize(() => this.setSubmitInProgress(false)),
            takeUntil(this.untilSubject)
          )
          .subscribe(() => {
            this.closeModal();
            this.snackbar.showSuccessSnackBar('The question has been successfully created');
            this.questionsService.getQuestions({filter: null, usePrevParams: true, update: true});
            this.questionsService.getQuestionTopics();
          });
      }
    }
  }

  addTime(minutes: number) {
    this.timeChanged = true;
    const existingTime = this.questionForm.value.time || 0;
    const newTime = existingTime + minutes;
    const updatedTime = newTime >= 0 ? newTime : 0;
    this.questionForm.patchValue({
      time: updatedTime
    });
  }

  formatTime(minutes: number): string {
    return formatTime(minutes);
  }

  createNewTopic(topic: string): string {
    return topic;
  }

  private setSubmitInProgress(value: boolean) {
    this.isSubmitInProgress = value;
  }
}
