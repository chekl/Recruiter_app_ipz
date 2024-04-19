import {Component, OnInit} from '@angular/core';
import {User} from 'src/app/common/models/user.model';
import {AuthService} from 'src/app/common/services/auth.service';
import {StorageService} from 'src/app/common/services/storage.service';
import {Router} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgIf} from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'ta-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  imports: [
    MatToolbarModule,
    RouterLinkActive,
    RouterLink,
    NgIf,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule
  ],
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  public initials: string;
  public currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.storageService.getUser();
    this.showUserDataInToolbar();
  }

  showUserDataInToolbar() {
    if (this.currentUser) {
      this.initials = this.getInitials([this.currentUser?.firstName, this.currentUser?.lastName]);
    }
  }

  private getInitials(name: string[]): string {
    const initials = name.map(name => name.charAt(0).toUpperCase());
    return initials.join('');
  }

  public logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clean();
        this.router.navigate(['auth']);
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
