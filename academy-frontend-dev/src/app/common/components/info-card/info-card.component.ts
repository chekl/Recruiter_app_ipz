import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';

@Component({
  standalone: true,
  selector: 'ta-info-card',
  templateUrl: './info-card.component.html',
  imports: [MatButtonModule, NgIf, LoaderComponent],
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent {
  @Input() public buttonText: string;
  @Input() public titleText: string;
  @Input() public contentText: string;
  @Input() public isSpan: boolean = false;
  @Input() public isPercent: boolean = false;
  @Input() public spanCompletedValue: number = 0;
  @Input() public spanMaximumValue: number = 0;
  @Input() public isFlatButton: boolean = true;
  @Input() public isButtonDisabled: boolean = false;
  @Input() public isLoading: boolean = false;
  @Output() public buttonClicked: EventEmitter<void> = new EventEmitter<void>();

  public onButtonClick() {
    this.buttonClicked.emit();
  }
}
