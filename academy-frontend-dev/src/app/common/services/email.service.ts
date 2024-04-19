import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import {Application} from 'src/app/common/models/application.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmailToReviewer(applicationId: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/send-result/${applicationId}`, {});
  }

  public sendEmailToApplicationCreator(application: Application): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/send-review`, application);
  }
}
