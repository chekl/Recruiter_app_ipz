import {AfterViewInit, Component, OnInit} from '@angular/core';
import {User} from 'src/app/common/models/user.model';
import {AuthService} from 'src/app/common/services/auth.service';
import {Router} from '@angular/router';
import {StorageService} from 'src/app/common/services/storage.service';
import {CommonModule, DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {LoadingService} from 'src/app/common/services/loading.service';
import {Observable} from 'rxjs';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';

@Component({
  selector: 'ta-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.scss'],
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, LoaderComponent]
})
export class AuthComponent implements AfterViewInit, OnInit {
  public copyrightDateEnd = Date.now();
  public user: User | null;
  public client: {requestCode(): void};
  public loading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loading$ = this.loadingService.loading$;
    this.user = this.storageService.getUser();
    if (this.user) {
      this.router.navigate(['vacancy']);
    }
  }

  ngAfterViewInit(): void {
    this.client = this.authService.getOauth2Client();
  }

  singin(): void {
    this.client.requestCode();
  }
}
