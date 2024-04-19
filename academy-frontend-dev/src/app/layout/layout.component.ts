import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, NavigationEnd, RouterOutlet} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import {CommonModule, NgIf} from '@angular/common';
import {ToolbarComponent} from 'src/app/layout/components/toolbar/toolbar.component';
import {ToolbarRoutes} from 'src/app/layout/components/toolbar/models/toolbar.enum';

@Component({
  selector: 'ta-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  imports: [RouterOutlet, CommonModule, NgIf, ToolbarComponent],
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  showToolbar: boolean = false;
  private navigationSubscription: Subscription | undefined;

  constructor(private router: Router) {}

  ngOnInit() {
    // Initializes the component and subscribes to router events to determine if toolbar should be displayed.
    this.shouldDisplayToolbar();
  }

  shouldDisplayToolbar() {
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.router.url.split('?')[0];
        const toolbarRoutes = Object.values(ToolbarRoutes);
        const toolbarRoutesRexExp = new RegExp(`/${toolbarRoutes.join('|')}/*`);
        this.showToolbar = toolbarRoutesRexExp.test(currentRoute);
      });
  }

  getBgColor() {
    const currentRoute = this.router.url;

    if (
      currentRoute.includes('/candidate/thank-you') ||
      currentRoute.includes('/not-found') ||
      currentRoute.includes('/candidate/sorry')
    ) {
      return 'white-bg';
    }
    return 'gray-bg';
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
