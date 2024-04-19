import {Component, OnInit, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgSelectModule} from '@ng-select/ng-select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogRef} from '@angular/material/dialog';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ValidationMessageComponent} from 'src/app/question/modal-form/validation-message/validation-message.component';
import {QuestionService} from 'src/app/common/services/question.service';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {TimeFormatPipe} from 'src/app/common/pipes/time-format.pipe';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'ta-answer-evaluate-question',
  standalone: true,
  templateUrl: './answer-evaluate-question.component.html',
  styleUrls: ['./answer-evaluate-question.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgSelectModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    CodemirrorModule,
    ValidationMessageComponent,
    TimeFormatPipe
  ]
})
export class AnswerEvaluateQuestionComponent implements OnInit {
  isLastQuestion: boolean;

  // ANSWER FIELD
  form: FormGroup;
  // timer for candidate
  elapsedTimeInMinutes: number = 0;
  timer: any;
  protected readonly environment = environment;

  // MARKS PART
  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedItemIndex: number = -1;
  isSelectionDisabled: boolean = false;

  onToggleChange(event: any) {
    this.selectedItemIndex = event.value;
    this.isSelectionDisabled = true;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<any>,
    private questionService: QuestionService,
    @Inject(MAT_DIALOG_DATA) public modal: any,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.handleGrading();
    this.form = this.fb.group({
      answer: ['', [Validators.required, Validators.maxLength(1000)]]
    });

    if (this.modal.data.isCandidate) {
      this.startQuestion();
    }
    this.setIsLastQuestion();
  }

  //clear answer input + start timer for next question
  startQuestion(): void {
    this.form.patchValue({
      answer: ''
    });
    this.startTimer();
  }

  private handleGrading(): void {
    if (this.modal.isReviewer) {
      this.isSelectionDisabled = this.modal.data.question.answer.mark >= 1;
      this.selectedItemIndex = this.modal.data.question.answer.mark - 1;
    }
  }

  public setMark(mark: number): void {
    if (this.modal.isReviewer) this.questionService.setMark(mark);
  }
  public handleTransitionButton(isPreviousQuestion: boolean): void {
    this.questionService.setAnotherQuestion(isPreviousQuestion);
    this.modal.data.currentQuestion = this.questionService.getCurrentQuestionIndex();
    this.modal.data.question = this.questionService.getCurrentQuestion();
    this.handleGrading();
  }

  //save answer and move to next question
  nextQuestion() {
    if (this.modal.data.isCandidate) {
      if (this.isAnswerEmpty()) return;
      this.saveAnswer();
      this.startQuestion();
    }
    this.modal.data.question = this.modal.nextQuestion();
    this.modal.data.currentQuestion++;
    this.setIsLastQuestion();
  }

  private startTimer(): void {
    this.timer = setInterval(() => {
      this.elapsedTimeInMinutes++;
    }, 60000);
  }

  private stopTimer(): void {
    clearInterval(this.timer);
    this.elapsedTimeInMinutes = 0;
  }

  private setIsLastQuestion(): void {
    this.isLastQuestion = this.modal.data.amountOfQuestions === this.modal.data.currentQuestion;
  }

  saveAnswer() {
    this.modal.saveAnswer(
      this.form.get('answer')?.value,
      this.elapsedTimeInMinutes,
      this.modal.data.question
    );
    this.stopTimer();
  }

  isAnswerEmpty(): boolean {
    if (!this.form.get('answer')?.value.length) {
      this.snackbarService.showErrorSnackBar('Can`t save empty answer!');
      return true;
    }
    return false;
  }

  closeModal() {
    if (this.modal.data.isCandidate) {
      if (this.isAnswerEmpty()) {
        return;
      }
      this.saveAnswer();

      if (this.isLastQuestion) {
        this.snackbarService.showSuccessSnackBar('Test is completed!');
      }
    }
    this.dialogRef.close();
  }
}
