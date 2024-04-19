import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {formatTime} from 'src/app/utils/modal-form.utils';
import {CommonModule} from '@angular/common';
import {FieldWrapperComponent} from 'src/app/question/modal-form/field-wrapper/field-wrapper.component';
import {Question} from 'src/app/common/models/question.model';
import {ModalComponent} from 'src/app/common/components/modal/modal.component';

@Component({
  selector: 'ta-question-details-form',
  standalone: true,
  imports: [CommonModule, FieldWrapperComponent, ModalComponent],
  templateUrl: './question-details-form.component.html',
  styleUrls: ['./question-details-form.component.scss']
})
export class QuestionDetailsFormComponent {
  constructor(
    private dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public modalData: {questionData: Question}
  ) {}

  onClose() {
    this.dialogRef.closeAll();
  }

  formatTime(minutes: number): string {
    return formatTime(minutes);
  }
}
