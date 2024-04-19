import {Component, Input} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ta-vacancy-title',
  templateUrl: './vacancy-title.component.html',
  styleUrls: ['./vacancy-title.component.scss']
})
export class VacancyTitleComponent {
  @Input() public vacancyType: string;
  @Input() public vacancyTitle: string;
}
