import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, mergeMap, take} from 'rxjs';
import {environment} from 'src/environments/environment';
import {
  Application,
  ApplicationCreate,
  ApplicationUpdate
} from 'src/app/common/models/application.model';
import {SortOrder} from 'src/app/common/types/sort-order.type';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private applicationsSubject = new BehaviorSubject<Application[]>([]);
  public applications$ = this.applicationsSubject.asObservable();

  public selectedApplicationsSubject = new BehaviorSubject<Application[]>([]);
  public selectedApplications$ = this.selectedApplicationsSubject.asObservable();

  private reviewerChangeSubject = new BehaviorSubject<string>('');
  public reviewerChange$ = this.reviewerChangeSubject.asObservable();

  constructor(private http: HttpClient) {}

  getApplicationsNeedReview(
    userId: string,
    completed: SortOrder = 'desc'
  ): Observable<Application[]> {
    return this.http.get<Application[]>(
      `${environment.apiUrl}/applications/need-review/${userId}`,
      {params: new HttpParams().append('completed', completed)}
    );
  }

  updateApplication(id: string, applicationUpdate: ApplicationUpdate): Observable<Application> {
    return this.http.patch<Application>(
      `${environment.apiUrl}/applications/${id}`,
      applicationUpdate
    );
  }

  createApplication(applicationCreate: ApplicationCreate): Observable<Application> {
    return this.http.post<Application>(`${environment.apiUrl}/applications`, applicationCreate);
  }

  public deleteApplications(applicationIds: string[]): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/applications`, {
      body: {applications: applicationIds}
    });
  }

  public updateReviewer(reviewerId: string, applicationIds: string[]) {
    return this.http.patch<Application[]>(`${environment.apiUrl}/applications`, {
      keys: applicationIds,
      data: {reviewer: reviewerId}
    });
  }

  removeApplications(): Observable<any> {
    return this.selectedApplications$.pipe(
      take(1),
      mergeMap(selectedApplications =>
        this.deleteApplications(selectedApplications.map(app => app._id))
      )
    );
  }

  changeReviewer(reviewerId: string) {
    return this.selectedApplications$.pipe(
      take(1),
      mergeMap(selectedApplications =>
        this.updateReviewer(
          reviewerId,
          selectedApplications.map(app => app._id)
        )
      )
    );
  }
}
