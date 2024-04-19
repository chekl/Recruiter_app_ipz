import {DOCUMENT} from '@angular/common';
import {Inject, Injectable} from '@angular/core';
import {User} from 'src/app/common/models/user.model';
import {WindowService} from '../../core/services/window.service';

const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private windowService: WindowService) {}

  public clean(): void {
    this.windowService.window?.localStorage.clear();
  }

  public saveUser(user: User): void {
    this.windowService.window?.localStorage.removeItem(USER_KEY);
    this.windowService.window?.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): User | null {
    const user = this.windowService.window?.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public isLoggedIn(): boolean {
    const user = this.windowService.window?.localStorage.getItem(USER_KEY);
    if (user) {
      return true;
    }

    return false;
  }
}
