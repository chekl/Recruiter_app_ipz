import {Component} from '@angular/core';
import {QuestionLayoutComponent} from 'src/app/question/components/question-layout/question-layout.component';

@Component({
  selector: 'ta-question',
  standalone: true,
  template: `<ta-question-layout></ta-question-layout> `,
  styleUrls: [],
  imports: [QuestionLayoutComponent]
})
export class QuestionComponent {}
