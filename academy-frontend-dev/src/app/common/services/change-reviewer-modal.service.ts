import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Reviewer} from 'src/app/common/models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ChangeReviewerModalService {
  constructor(private http: HttpClient) {}

  private _reviewer$ = new BehaviorSubject<Reviewer[]>([]);
  public readonly reviewer$ = this._reviewer$.asObservable();

  getReviewers(email: string): Observable<Reviewer[]> {
    return this.http.get<Reviewer[]>(`${environment.apiUrl}/users/reviewers/${email}`);
  }
}
