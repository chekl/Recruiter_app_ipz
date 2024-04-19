import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoldTextPipe} from 'src/app/common/pipes/bold-text.pipe';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {ModalComponent} from 'src/app/common/components/modal/modal.component';

@Component({
  selector: 'ta-modal-confirm',
  standalone: true,
  imports: [CommonModule, BoldTextPipe, MatButtonModule, ModalComponent, MatDialogModule],
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public modalData: {title: string; description: string; mainButtonName: string}
  ) {}
}
