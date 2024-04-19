export interface CandidateWithId extends Candidate {
  _id: string;
}

export interface Candidate {
  email: string;
  firstName: string;
  lastName: string;
}

export class Candidate implements Candidate {
  email: string;
  firstName: string;
  lastName: string;

  constructor(email: string, firstName: string, lastName: string) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
