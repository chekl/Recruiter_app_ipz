import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'field-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './field-wrapper.component.html',
  styleUrls: ['./field-wrapper.component.scss']
})
export class FieldWrapperComponent {
  @Input() label: string;
  @Input() controlName: string;
}
