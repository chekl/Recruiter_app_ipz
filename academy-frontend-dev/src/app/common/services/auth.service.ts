import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from 'src/app/common/models/user.model';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {StorageService} from 'src/app/common/services/storage.service';

declare var google: any;

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
    private snackBarService: SnackbarService
  ) {}

  getOauth2Client(): {requestCode(): void} {
    return google.accounts.oauth2.initCodeClient({
      client_id: environment.googleClientId,
      scope:
        'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
      ux_mode: 'popup',
      callback: (res: {code: string}) => this.handleGoogleSignIn(res.code)
    });
  }

  handleGoogleSignIn(code: string) {
    this.signin(code).subscribe({
      next: data => {
        this.router.navigate(['vacancy']);
        this.storageService.saveUser(data);
        this.snackBarService.showSuccessSnackBar('You have successfully logged in!');
      },
      error: error => {
        this.router.navigate(['auth']);
        this.snackBarService.showErrorSnackBar('User not found. Please try again.');
      }
    });
  }

  signin(token: string): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/signin`, {code: token}, httpOptions);
  }

  refreshToken(): Observable<any> {
    return this.http.post<User>(`${environment.apiUrl}/auth/refreshtoken`, {}, httpOptions);
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}, httpOptions);
  }
}
