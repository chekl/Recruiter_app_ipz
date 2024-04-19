import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'validation-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent {
  @Input() control: AbstractControl<any, any> | null;
  @Input() errorMessage: string;
}
