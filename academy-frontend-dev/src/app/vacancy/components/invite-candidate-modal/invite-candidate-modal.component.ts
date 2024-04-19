import {CommonModule} from '@angular/common';
import {Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, NgForm, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {Candidate, CandidateWithId} from 'src/app/common/models/candidate.model';
import {InviteCandidateModalService} from 'src/app/common/services/invite-candidate-modal.service';
import {debounceTime, filter, Observable, Subject, switchMap, tap} from 'rxjs';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Vacancy} from 'src/app/common/models/vacancy.model';
import {SnackbarService} from 'src/app/core/services/snackbar.service';
import {ApplicationStatuses} from 'src/app/common/enums/enums';
import {SEVENTY_TWO_HOURS_IN_MS} from 'src/app/common/constants/seventy-two-hours-in-ms';
import {
  Application,
  ApplicationCreate,
  ApplicationUpdate
} from 'src/app/common/models/application.model';
import {ApplicationsService} from 'src/app/common/services/applications.service';
import {StorageService} from 'src/app/common/services/storage.service';
import {LoaderComponent} from 'src/app/common/components/loader/loader.component';
import {ModalComponent} from 'src/app/common/components/modal/modal.component';

@Component({
  selector: 'ta-invite-candidate-modal',
  standalone: true,
  templateUrl: './invite-candidate-modal.component.html',
  styleUrls: ['./invite-candidate-modal.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    LoaderComponent,
    ModalComponent,
    MatDialogModule
  ]
})
export class InviteCandidateModalComponent implements OnInit, OnDestroy {
  @Output() inviteEvent = new EventEmitter<Application>();

  private untilSubject$: Subject<void> = new Subject<void>();
  private _emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  private application: Application | undefined | ApplicationCreate;

  candidateModel: Candidate = new Candidate('', '', '');
  candidate: Candidate | null | CandidateWithId;
  emailCtrl = new FormControl('', Validators.pattern(this._emailPattern));
  isSelected = false;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<InviteCandidateModalComponent>,
    @Inject(MAT_DIALOG_DATA) private vacancy: Vacancy,
    private inviteCandidateModalService: InviteCandidateModalService,
    private snackbarService: SnackbarService,
    private applicationService: ApplicationsService,
    private storageService: StorageService
  ) {}

  get modalNote() {
    if (this.isSelected) return 'Please, check details';
    else if (!this.candidate && this.emailCtrl.value && this.emailCtrl.valid)
      return '* This is a new candidate in the database. Please, add details';
    else return 'Please, write email to find candidate';
  }

  ngOnInit(): void {
    this.emailCtrl.valueChanges
      .pipe(
        debounceTime(250),
        filter(() => this.emailCtrl.valid),
        switchMap(email => this.inviteCandidateModalService.getCandidateByEmail(email as string))
      )
      .subscribe(candidate => {
        if (candidate) {
          this.candidate = candidate;
        } else {
          this.candidate = null;
          if (this.isSelected) this.setCandidate();
        }
      });
  }

  get isFormValid() {
    return (
      this.emailCtrl.valid &&
      this.candidateModel.firstName &&
      this.candidateModel.lastName &&
      this.candidateModel.firstName.length >= 2 &&
      this.candidateModel.lastName.length >= 2
    );
  }

  onOptionSelected() {
    this.setCandidate();
  }

  setCandidate(): void {
    if (this.candidate) {
      this.candidateModel = new Candidate(
        this.candidate!.email,
        this.candidate!.firstName,
        this.candidate!.lastName
      );
      this.isSelected = true;
    } else {
      this.candidateModel = new Candidate('', '', '');
      this.isSelected = false;
    }
  }

  onSubmit(form: NgForm): void {
    if (!this.isSelected) this.candidateModel.email = this.emailCtrl.value as string;

    if (this.canCandidateBeInvited()) this.inviteCandidate();
    else {
      this.snackbarService.showErrorSnackBar(
        `${this.candidateModel.firstName} ${this.candidateModel.lastName} is already invited`
      );
      this.candidate = null;
    }

    form.resetForm();
    this.emailCtrl.reset();
  }

  closeModal() {
    this.dialogRef.close();
  }

  private canCandidateBeInvited(): boolean {
    this.application = this.vacancy.applications.find(
      application => (application.candidate as Candidate).email === this.candidateModel.email
    );

    if (this.application)
      return (
        (this.application.status === ApplicationStatuses.INVITED ||
          this.application.status === ApplicationStatuses.IN_PROGRESS ||
          this.application.status === ApplicationStatuses.CLOSED) &&
        this.isLinkTimeExpired(this.application.invited)
      );

    return true;
  }

  private isLinkTimeExpired(invitedString: Date) {
    const invitedDate = new Date(invitedString);
    const timeDifference = Date.now() - invitedDate.getTime();
    return timeDifference > SEVENTY_TWO_HOURS_IN_MS;
  }

  private inviteCandidate() {
    if (this.application) this.updateApplication();
    else this.createApplication();
  }

  private updateApplication() {
    const applicationUpdate: ApplicationUpdate = {
      invited: Date.now(),
      status: ApplicationStatuses.INVITED
    };

    this.showLoader();
    this.applicationService
      .updateApplication((this.application as Application & {_id: string})._id, applicationUpdate)
      .pipe(switchMap(application => this.inviteCandidateModalService.sendInvite(application)))
      .subscribe(() => {
        this.snackbarService.showSuccessSnackBar(
          `${this.candidate!.firstName} ${this.candidate!.lastName} has been successfully invited`
        );
        this.candidate = null;
        this.hideLoader();
      });
  }

  private createApplication() {
    let candidate$: Observable<CandidateWithId | null>;

    this.showLoader();

    if (this.candidate)
      candidate$ = this.inviteCandidateModalService.getCandidateByEmail(this.candidateModel.email);
    else candidate$ = this.inviteCandidateModalService.createCandidate(this.candidateModel);

    candidate$
      .pipe(
        switchMap(candidate => {
          this.candidate = candidate;
          this.application = this.createApplicationBody();
          return this.applicationService
            .createApplication(this.application)
            .pipe(tap(app => (this.application = app)));
        }),
        switchMap(application => this.inviteCandidateModalService.sendInvite(application))
      )
      .subscribe(() => {
        this.snackbarService.showSuccessSnackBar(
          `${this.candidate!.firstName} ${this.candidate!.lastName} has been successfully invited`
        );
        this.inviteEvent.emit(this.application as Application);
        this.candidate = null;
        this.hideLoader();
      });
  }

  private createApplicationBody(): ApplicationCreate {
    return {
      vacancy: this.vacancy._id,
      reviewer: this.storageService.getUser()!._id,
      candidate: (this.candidate as CandidateWithId)._id,
      creator: this.storageService.getUser()!._id,
      invited: Date.now(),
      questions: this.vacancy.questions.map(question => {
        return {
          title: question.title,
          topics: question.topics.map(topic => topic._id),
          type: question.type._id,
          description: question.description,
          time: question.time
        };
      })
    };
  }

  private showLoader() {
    this.loading = true;
  }

  private hideLoader() {
    this.loading = false;
  }

  ngOnDestroy(): void {
    this.untilSubject$.next();
    this.untilSubject$.complete();
  }
}
