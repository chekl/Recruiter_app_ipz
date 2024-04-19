import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Candidate, CandidateWithId} from 'src/app/common/models/candidate.model';
import {environment} from 'src/environments/environment';
import {Application} from 'src/app/common/models/application.model';
import {InviteResponse} from 'src/app/common/models/invite-response.model';

@Injectable({
  providedIn: 'root'
})
export class InviteCandidateModalService {
  constructor(private http: HttpClient) {}

  getCandidateByEmail(email: string): Observable<CandidateWithId | null> {
    return this.http.get<CandidateWithId | null>(`${environment.apiUrl}/candidates/${email}`);
  }

  createCandidate(candidate: Candidate): Observable<CandidateWithId> {
    return this.http.post<CandidateWithId>(`${environment.apiUrl}/candidates`, {...candidate});
  }

  sendInvite(application: Application): Observable<InviteResponse> {
    return this.http.post<InviteResponse>(`${environment.apiUrl}/send-invite`, {...application});
  }
}
