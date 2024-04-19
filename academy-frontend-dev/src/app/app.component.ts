import {Component} from '@angular/core';
import {LayoutComponent} from 'src/app/layout/layout.component';

@Component({
  selector: 'ta-root',
  standalone: true,
  template: `<ta-layout></ta-layout>`,
  imports: [LayoutComponent]
})
export class AppComponent {}
