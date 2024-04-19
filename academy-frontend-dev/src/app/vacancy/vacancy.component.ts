import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'ta-vacancy',
  standalone: true,
  template: ` <router-outlet></router-outlet> `,
  imports: [RouterOutlet, HttpClientModule],
  styles: []
})
export class VacancyComponent {}
